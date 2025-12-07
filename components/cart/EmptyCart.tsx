'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';

export interface EmptyCartProps {
  variant?: 'sidebar' | 'page';
}

/**
 * Empty cart state component with call-to-action to continue shopping.
 * Supports both sidebar and full page contexts.
 *
 * @param {EmptyCartProps} props - Display variant (sidebar or page).
 */
export function EmptyCart({ variant = 'page' }: EmptyCartProps) {
  const isSidebar = variant === 'sidebar';

  return (
    <div className={`flex flex-col items-center justify-center ${isSidebar ? 'py-12' : 'py-16'}`}>
      {/* Shopping Bag Icon */}
      <div className="mb-4">
        <svg
          className={`${isSidebar ? 'h-16 w-16' : 'h-24 w-24'} text-gray-300`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      </div>

      {/* Message */}
      <h3 className={`${isSidebar ? 'text-lg' : 'text-xl'} mb-2 font-semibold text-gray-900`}>
        Your cart is empty
      </h3>
      <p className="mb-6 max-w-xs text-center text-sm text-gray-600">
        {isSidebar
          ? 'Add items to get started'
          : "Looks like you haven't added anything to your cart yet. Start shopping to fill it up!"}
      </p>

      {/* CTA Button */}
      <Link href="/products">
        <Button size={isSidebar ? 'default' : 'lg'}>Continue Shopping</Button>
      </Link>
    </div>
  );
}
