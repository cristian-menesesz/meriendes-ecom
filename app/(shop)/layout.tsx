import { Header } from '@/components/layout';

/**
 * Layout for the shop section of the application.
 * Provides consistent navigation and structure for product browsing,
 * cart, and checkout flows.
 */
export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <Header />

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
