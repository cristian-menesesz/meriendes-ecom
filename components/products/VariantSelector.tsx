'use client';

import type { ProductVariant } from '@/types';
import { formatCurrency } from '@/lib/utils/currency';

export interface VariantSelectorProps<
  T extends ProductVariant & { inventory: { quantityAvailable: number } | null },
> {
  variants: T[];
  selectedVariant: T | null;
  onVariantChange: (variant: T) => void;
}

/**
 * Variant selector component for choosing product size/flavor/type.
 * Pure presentational component - receives data and callbacks from parent.
 *
 * Features:
 * - Visual selection state
 * - Stock availability indicators
 * - Price display per variant
 * - Disabled state for out-of-stock variants
 * - Keyboard accessible
 *
 * @param {VariantSelectorProps} props - Variants, selection state, and change handler.
 */
export function VariantSelector<
  T extends ProductVariant & { inventory: { quantityAvailable: number } | null },
>({ variants, selectedVariant, onVariantChange }: VariantSelectorProps<T>) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-900">Select Size/Option</h3>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {variants.map((variant) => {
          const isSelected = selectedVariant?.id === variant.id;
          const isAvailable = (variant.inventory?.quantityAvailable || 0) > 0;
          const isLowStock = isAvailable && (variant.inventory?.quantityAvailable || 0) <= 5;

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => isAvailable && onVariantChange(variant)}
              disabled={!isAvailable}
              className={`relative flex flex-col items-center justify-center rounded-lg border px-4 py-3 transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                  : isAvailable
                    ? 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                    : 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
              } `}
              aria-label={`Select ${variant.variantName} for ${formatCurrency(variant.price)}`}
              aria-pressed={isSelected}
            >
              {/* Variant Name */}
              <span className="text-sm font-medium">{variant.variantName}</span>

              {/* Price */}
              <span className="mt-1 text-xs">{formatCurrency(variant.price)}</span>

              {/* Stock Indicator */}
              {!isAvailable && (
                <span className="absolute top-1 right-1 flex h-2 w-2 items-center justify-center">
                  <span className="inline-flex h-full w-full rounded-full bg-red-400" />
                </span>
              )}
              {isLowStock && (
                <span className="absolute top-1 right-1 flex h-2 w-2 items-center justify-center">
                  <span className="inline-flex h-full w-full rounded-full bg-orange-400" />
                </span>
              )}

              {/* Selected Checkmark */}
              {isSelected && (
                <span className="absolute top-2 right-2">
                  <svg className="h-4 w-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Stock Legend */}
      <div className="mt-3 flex items-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
          <span>In Stock</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-orange-400" />
          <span>Low Stock</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-red-400" />
          <span>Out of Stock</span>
        </div>
      </div>
    </div>
  );
}
