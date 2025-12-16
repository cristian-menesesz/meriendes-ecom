'use client';

/**
 * Client Component for printing order details.
 * Must be client-side to access window.print() API.
 */
export function PrintOrderButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex-1 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
    >
      Print Order
    </button>
  );
}
