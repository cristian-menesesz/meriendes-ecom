import { createClient, createServiceClient } from '@/lib/supabase/server';
import type { Product, ProductVariant, ProductCategory, Inventory } from '@/types';

/**
 * Extended product type with variants and inventory for display.
 */
export interface ProductWithDetails extends Product {
  category: ProductCategory | null;
  variants: (ProductVariant & {
    inventory: Inventory | null;
  })[];
}

/**
 * Fetches all active products with their variants and inventory.
 * Only returns products where is_active = true and at least one variant is active.
 * Enforces RLS policies for public access.
 *
 * @returns {Promise<ProductWithDetails[]>} Array of products with variants and inventory.
 * @throws {Error} If the Supabase query fails.
 */
export async function getActiveProducts(): Promise<ProductWithDetails[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select(
      `
      *,
      category:product_categories(*),
      variants:product_variants(
        *,
        inventory(*)
      )
    `
    )
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`);
  }

  // Map snake_case from Supabase to our camelCase types
  const mapped: ProductWithDetails[] = (data || []).map((p) => mapProductRow(p));

  // Filter products that have at least one active variant (after mapping)
  const productsWithActiveVariants = mapped.filter((product) =>
    product.variants?.some((v) => v.isActive)
  );

  return productsWithActiveVariants;
}

/**
 * Fetches active products for build-time static generation.
 * Uses service client to avoid cookies() call during build.
 * Should ONLY be used in generateStaticParams.
 *
 * @returns {Promise<ProductWithDetails[]>} Array of products with variants and inventory.
 * @throws {Error} If the Supabase query fails.
 */
export async function getActiveProductsForBuild(): Promise<ProductWithDetails[]> {
  // During build time, env vars might not be available
  // Return empty array to allow build to continue without static generation
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn('⚠️ Supabase credentials not available during build. Skipping static generation.');
    return [];
  }

  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('products')
    .select(
      `
      *,
      category:product_categories(*),
      variants:product_variants(
        *,
        inventory(*)
      )
    `
    )
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`);
  }

  // Map snake_case from Supabase to our camelCase types
  const mapped: ProductWithDetails[] = (data || []).map((p) => mapProductRow(p));

  // Filter products that have at least one active variant (after mapping)
  const productsWithActiveVariants = mapped.filter((product) =>
    product.variants?.some((v) => v.isActive)
  );

  return productsWithActiveVariants;
}

/**
 * Fetches featured products for homepage or promotional displays.
 * Returns products where is_featured = true and is_active = true.
 *
 * @param {number} limit - Maximum number of featured products to return.
 * @returns {Promise<ProductWithDetails[]>} Array of featured products.
 * @throws {Error} If the Supabase query fails.
 */
export async function getFeaturedProducts(limit: number = 6): Promise<ProductWithDetails[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select(
      `
      *,
      category:product_categories(*),
      variants:product_variants(
        *,
        inventory(*)
      )
    `
    )
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('display_order', { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch featured products: ${error.message}`);
  }
  return (data || []).map((p) => mapProductRow(p));
}

/**
 * Fetches products by category slug.
 *
 * @param {string} categorySlug - The category slug to filter by.
 * @returns {Promise<ProductWithDetails[]>} Array of products in the category.
 * @throws {Error} If the Supabase query fails.
 */
export async function getProductsByCategory(categorySlug: string): Promise<ProductWithDetails[]> {
  const supabase = await createClient();

  // First get the category
  const { data: category, error: categoryError } = await supabase
    .from('product_categories')
    .select('id')
    .eq('slug', categorySlug)
    .eq('is_active', true)
    .single<{ id: number }>();

  if (categoryError || !category) {
    return [];
  }

  const { data, error } = await supabase
    .from('products')
    .select(
      `
      *,
      category:product_categories(*),
      variants:product_variants(
        *,
        inventory(*)
      )
    `
    )
    .eq('is_active', true)
    .eq('category_id', category.id)
    .order('display_order', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch products by category: ${error.message}`);
  }
  return (data || []).map((p) => mapProductRow(p));
}

/**
 * Fetches all active product categories for navigation/filtering.
 *
 * @returns {Promise<ProductCategory[]>} Array of active categories.
 * @throws {Error} If the Supabase query fails.
 */
export async function getActiveCategories(): Promise<ProductCategory[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }

  return data || [];
}

/**
 * Searches products by name or description.
 *
 * @param {string} searchQuery - The search term.
 * @returns {Promise<ProductWithDetails[]>} Array of matching products.
 * @throws {Error} If the Supabase query fails.
 */
export async function searchProducts(searchQuery: string): Promise<ProductWithDetails[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select(
      `
      *,
      category:product_categories(*),
      variants:product_variants(
        *,
        inventory(*)
      )
    `
    )
    .eq('is_active', true)
    .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
    .order('display_order', { ascending: true });

  if (error) {
    throw new Error(`Failed to search products: ${error.message}`);
  }
  return (data || []).map((p) => mapProductRow(p));
}

/**
 * Fetches a single product by its slug with all variants and inventory.
 * Returns null if product is not found or not active.
 * Enforces RLS policies for public access.
 *
 * @param {string} slug - The URL slug of the product to fetch.
 * @returns {Promise<ProductWithDetails | null>} The product with variants or null if not found.
 * @throws {Error} If the Supabase query fails.
 */
export async function getProductBySlug(slug: string): Promise<ProductWithDetails | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select(
      `
      *,
      category:product_categories(*),
      variants:product_variants(
        *,
        inventory(*)
      )
    `
    )
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    // Not found is expected, throw only on actual errors
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch product: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  const product = mapProductRow(data);

  // Ensure product has at least one active variant
  if (!product.variants?.some((v) => v.isActive)) {
    return null;
  }

  return product;
}

// --- Mapping helpers: convert Supabase snake_case rows to our camelCase types ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProductRow(p: any): ProductWithDetails {
  return {
    id: p.id,
    categoryId: p.category_id ?? null,
    name: p.name,
    slug: p.slug,
    description: p.description ?? null,
    shortDescription: p.short_description ?? null,
    imageUrl: p.image_url ?? null,
    isActive: Boolean(p.is_active),
    isSeasonal: Boolean(p.is_seasonal),
    isFeatured: Boolean(p.is_featured),
    displayOrder: p.display_order ?? 0,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
    // category (optional)
    category: p.category
      ? {
          id: p.category.id,
          name: p.category.name,
          slug: p.category.slug,
          description: p.category.description ?? null,
          displayOrder: p.category.display_order ?? 0,
          isActive: Boolean(p.category.is_active),
          createdAt: p.category.created_at,
        }
      : null,
    // variants with inventory
    variants: Array.isArray(p.variants)
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        p.variants.map((v: any) => ({
          id: v.id,
          productId: v.product_id,
          sku: v.sku,
          variantName: v.variant_name,
          price: Number(v.price),
          compareAtPrice: v.compare_at_price != null ? Number(v.compare_at_price) : null,
          cost: v.cost != null ? Number(v.cost) : null,
          weightGrams: v.weight_grams != null ? Number(v.weight_grams) : null,
          isActive: Boolean(v.is_active),
          displayOrder: v.display_order ?? 0,
          stripePriceId: v.stripe_price_id ?? null,
          stripeProductId: v.stripe_product_id ?? null,
          createdAt: v.created_at,
          updatedAt: v.updated_at,
          inventory: v.inventory
            ? {
                id: v.inventory.id,
                variantId: v.inventory.variant_id,
                quantityAvailable: Number(v.inventory.quantity_available),
                quantityReserved: Number(v.inventory.quantity_reserved),
                lowStockThreshold: Number(v.inventory.low_stock_threshold),
                updatedAt: v.inventory.updated_at,
              }
            : null,
        }))
      : [],
  } as ProductWithDetails;
}
