/**
 * Stripe Product Sync Script
 *
 * Purpose: Syncs products and variants from the database to Stripe.
 * Creates Stripe Products (one per database product) and Stripe Prices (one per variant).
 *
 * Architecture:
 * - 1 Database Product → 1 Stripe Product
 * - 1 Product Variant → 1 Stripe Price
 *
 * Usage:
 *   npx tsx scripts/sync-products-to-stripe.ts
 *
 * Environment Variables Required:
 *   STRIPE_SECRET_KEY - Your Stripe secret key (test mode recommended)
 *   NEXT_PUBLIC_SUPABASE_URL - Your Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY - Supabase service role key (for admin operations)
 */

import dotenv from 'dotenv';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' }); // =====================================================
// CONFIGURATION
// =====================================================

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is required');
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error('Supabase environment variables are required');
}

// Initialize Stripe client
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2025-11-17.clover',
});

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// =====================================================
// TYPE DEFINITIONS
// =====================================================

interface Product {
  id: string;
  name: string;
  description: string;
  short_description: string;
  image_url: string;
  is_active: boolean;
}

interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  variant_name: string;
  price: number;
  stripe_price_id: string | null;
  stripe_product_id: string | null;
  is_active: boolean;
}

interface ProductWithVariants extends Product {
  variants: ProductVariant[];
}

interface SyncResult {
  success: boolean;
  productsCreated: number;
  pricesCreated: number;
  productsUpdated: number;
  pricesUpdated: number;
  errors: Array<{ productName: string; error: string }>;
}

// =====================================================
// MAIN SYNC FUNCTION
// =====================================================

async function syncProductsToStripe(): Promise<SyncResult> {
  console.log('🚀 Starting Stripe product sync...\n');

  const result: SyncResult = {
    success: true,
    productsCreated: 0,
    pricesCreated: 0,
    productsUpdated: 0,
    pricesUpdated: 0,
    errors: [],
  };

  try {
    // Fetch all active products with their variants from the database
    const products = await fetchProductsWithVariants();
    console.log(`📦 Found ${products.length} products to sync\n`);

    // Process each product
    for (const product of products) {
      try {
        await syncProduct(product, result);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`❌ Error syncing product "${product.name}": ${errorMessage}`);
        result.errors.push({
          productName: product.name,
          error: errorMessage,
        });
        result.success = false;
      }
    }

    // Print summary
    printSummary(result);

    return result;
  } catch (error) {
    console.error('❌ Fatal error during sync:', error);
    result.success = false;
    throw error;
  }
}

// =====================================================
// DATABASE OPERATIONS
// =====================================================

/**
 * Fetches all active products with their variants from Supabase.
 */
async function fetchProductsWithVariants(): Promise<ProductWithVariants[]> {
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (productsError) {
    console.error('Supabase Error Details:', productsError);
    throw new Error(`Failed to fetch products: ${productsError.message}`);
  }

  if (!products || products.length === 0) {
    console.warn('⚠️  No active products found in database.');
    console.log('Make sure you have run the seed data SQL file:');
    console.log('  psql -h <host> -U postgres -d postgres -f docs/seed-dev-data.sql');
    return [];
  }

  const { data: variants, error: variantsError } = await supabase
    .from('product_variants')
    .select('*')
    .eq('is_active', true);

  if (variantsError) {
    console.error('Supabase Error Details:', variantsError);
    throw new Error(`Failed to fetch variants: ${variantsError.message}`);
  }

  // Group variants by product_id
  const variantsByProduct = new Map<string, ProductVariant[]>();
  for (const variant of variants) {
    if (!variantsByProduct.has(variant.product_id)) {
      variantsByProduct.set(variant.product_id, []);
    }
    variantsByProduct.get(variant.product_id)!.push(variant);
  }

  // Combine products with their variants
  return products.map((product) => ({
    ...product,
    variants: variantsByProduct.get(product.id) || [],
  }));
}

/**
 * Updates a product variant in the database with Stripe IDs.
 */
async function updateVariantStripeIds(
  variantId: string,
  stripeProductId: string,
  stripePriceId: string
): Promise<void> {
  const { error } = await supabase
    .from('product_variants')
    .update({
      stripe_product_id: stripeProductId,
      stripe_price_id: stripePriceId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', variantId);

  if (error) {
    throw new Error(`Failed to update variant ${variantId}: ${error.message}`);
  }
}

// =====================================================
// STRIPE OPERATIONS
// =====================================================

/**
 * Syncs a single product and its variants to Stripe.
 */
async function syncProduct(product: ProductWithVariants, result: SyncResult): Promise<void> {
  console.log(`📝 Processing: ${product.name}`);

  // Check if this product already has a Stripe Product ID
  const existingStripeProductId = product.variants[0]?.stripe_product_id;

  let stripeProduct: Stripe.Product;

  if (existingStripeProductId) {
    // Verify the product exists in Stripe
    try {
      stripeProduct = await stripe.products.retrieve(existingStripeProductId);
      console.log(`  ✓ Product already exists in Stripe: ${stripeProduct.id}`);
      result.productsUpdated++;
    } catch {
      // Product doesn't exist in Stripe, create a new one
      console.log(`  ⚠️  Stripe product not found, creating new one...`);
      stripeProduct = await createStripeProduct(product);
      result.productsCreated++;
    }
  } else {
    // Create new Stripe Product
    stripeProduct = await createStripeProduct(product);
    result.productsCreated++;
  }

  // Sync each variant as a Stripe Price
  for (const variant of product.variants) {
    await syncVariant(variant, stripeProduct.id, product.name, result);
  }

  console.log(''); // Empty line for readability
}

/**
 * Creates a new Stripe Product.
 * Stripe supports image URLs - they will be automatically downloaded and hosted by Stripe.
 */
async function createStripeProduct(product: Product): Promise<Stripe.Product> {
  const stripeProduct = await stripe.products.create({
    name: product.name,
    description: product.short_description || product.description,
    images: product.image_url ? [product.image_url] : [],
    active: product.is_active,
    metadata: {
      database_product_id: product.id,
    },
  });

  console.log(`  ✓ Created Stripe Product: ${stripeProduct.id}`);
  return stripeProduct;
}

/**
 * Syncs a single variant to Stripe as a Price.
 */
async function syncVariant(
  variant: ProductVariant,
  stripeProductId: string,
  productName: string,
  result: SyncResult
): Promise<void> {
  // Check if this variant already has a Stripe Price ID
  if (variant.stripe_price_id) {
    try {
      // Verify the price exists in Stripe
      const existingPrice = await stripe.prices.retrieve(variant.stripe_price_id);
      console.log(`  ✓ Price already exists: ${variant.variant_name} - ${existingPrice.id}`);
      result.pricesUpdated++;
      return;
    } catch {
      // Price doesn't exist, create a new one
      console.log(`  ⚠️  Stripe price not found, creating new one...`);
    }
  }

  // Create new Stripe Price
  // Stripe requires the amount in cents, hence multiplying by 100.
  const amountInCents = Math.round(variant.price * 100);

  const stripePrice = await stripe.prices.create({
    product: stripeProductId,
    unit_amount: amountInCents,
    currency: 'usd',
    nickname: `${productName} - ${variant.variant_name}`,
    metadata: {
      database_variant_id: variant.id,
      sku: variant.sku,
      variant_name: variant.variant_name,
    },
  });

  console.log(
    `  ✓ Created Stripe Price: ${variant.variant_name} - $${variant.price} - ${stripePrice.id}`
  );
  result.pricesCreated++;

  // Update the database with the Stripe IDs
  await updateVariantStripeIds(variant.id, stripeProductId, stripePrice.id);
  console.log(`  ✓ Updated database variant: ${variant.id}`);
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

function printSummary(result: SyncResult): void {
  console.log('\n' + '='.repeat(50));
  console.log('📊 SYNC SUMMARY');
  console.log('='.repeat(50));
  console.log(`Status: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}`);
  console.log(`Products Created: ${result.productsCreated}`);
  console.log(`Products Updated: ${result.productsUpdated}`);
  console.log(`Prices Created: ${result.pricesCreated}`);
  console.log(`Prices Updated: ${result.pricesUpdated}`);
  console.log(`Errors: ${result.errors.length}`);

  if (result.errors.length > 0) {
    console.log('\n❌ Errors:');
    result.errors.forEach(({ productName, error }) => {
      console.log(`  - ${productName}: ${error}`);
    });
  }

  console.log('='.repeat(50) + '\n');
}

// =====================================================
// SCRIPT ENTRY POINT
// =====================================================

syncProductsToStripe()
  .then(() => {
    console.log('✅ Sync completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  });
