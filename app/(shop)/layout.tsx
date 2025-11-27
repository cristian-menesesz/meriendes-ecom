import Link from 'next/link';
import { Button } from '@/components/ui';

/**
 * Layout for the shop section of the application.
 * Provides consistent navigation and structure for product browsing,
 * cart, and checkout flows.
 */
export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo/Brand */}
            <Link href="/" className="text-xl font-bold text-gray-900">
              Meriendes
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex md:items-center md:gap-6">
              <Link
                href="/products"
                className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
              >
                Products
              </Link>
              <Link
                href="/products?category=featured"
                className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
              >
                Featured
              </Link>
            </div>

            {/* Cart Button */}
            <Link href="/cart">
              <Button variant="outline" size="sm">
                Cart
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {children}

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-600">
            <p>&copy; {new Date().getFullYear()} Meriendes E-commerce. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
