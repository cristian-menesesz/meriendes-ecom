'use client';

import Link from 'next/link';
import { CartButton } from '@/components/cart';

/**
 * Site header with navigation and cart button.
 * Sticky header with responsive layout.
 *
 * Features:
 * - Brand logo/name
 * - Main navigation links
 * - Cart button with badge
 * - Responsive mobile menu (future enhancement)
 * - Sticky positioning
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-indigo-600">Meriendes</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              href="/products"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
            >
              Products
            </Link>
            <Link
              href="/cart"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
            >
              Cart
            </Link>
          </div>

          {/* Cart Button */}
          <div className="flex items-center">
            <CartButton />
          </div>
        </div>
      </nav>
    </header>
  );
}
