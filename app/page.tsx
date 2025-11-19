import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-2xl font-bold">
            Meriendes
          </Link>
          <nav className="flex gap-6">
            <Link
              href="/products"
              className="text-sm font-medium hover:underline"
            >
              Products
            </Link>
            <Link href="/cart" className="text-sm font-medium hover:underline">
              Cart
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl text-center">
          <h1 className="mb-4 text-5xl font-bold tracking-tight">
            Welcome to Meriendes E-commerce
          </h1>
          <p className="mb-8 text-lg text-gray-600">
            A modern, full-stack e-commerce platform built with Next.js,
            Supabase, and Stripe. Browse our products and enjoy a seamless
            shopping experience.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/products"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-black px-8 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              Browse Products
            </Link>
            <Link
              href="/docs/OVERVIEW.md"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-gray-300 px-8 text-sm font-medium transition-colors hover:bg-gray-50"
            >
              View Documentation
            </Link>
          </div>
        </div>

        <div className="mt-16 grid max-w-4xl gap-8 sm:grid-cols-3">
          <div className="rounded-lg border p-6">
            <h3 className="mb-2 font-semibold">Next.js 16</h3>
            <p className="text-sm text-gray-600">
              Built with the latest App Router, Server Components, and Server
              Actions
            </p>
          </div>
          <div className="rounded-lg border p-6">
            <h3 className="mb-2 font-semibold">Supabase</h3>
            <p className="text-sm text-gray-600">
              PostgreSQL database with authentication and real-time
              subscriptions
            </p>
          </div>
          <div className="rounded-lg border p-6">
            <h3 className="mb-2 font-semibold">Stripe</h3>
            <p className="text-sm text-gray-600">
              Secure payment processing with Stripe Elements and webhooks
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>&copy; 2025 Meriendes E-commerce. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
