'use client';

import { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { useCartStore } from '@/store/cartStore';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';
import { EmptyCart } from './EmptyCart';

/**
 * Cart sidebar slide-over component for quick cart review without leaving current page.
 * Slides in from the right side of the screen with backdrop overlay.
 *
 * Features:
 * - Smooth slide-in/out animation
 * - Backdrop click to close
 * - Escape key to close
 * - Scrollable cart items
 * - Fixed cart summary at bottom
 * - Responsive (full-width on mobile)
 * - Accessible (ARIA labels, focus management)
 *
 * State managed by Zustand store (isSidebarOpen, closeSidebar).
 */
export function CartSidebar() {
  const isSidebarOpen = useCartStore((state) => state.isSidebarOpen);
  const closeSidebar = useCartStore((state) => state.closeSidebar);
  const items = useCartStore((state) => state.items);
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();

  return (
    <Transition show={isSidebarOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeSidebar}>
        {/* Backdrop */}
        <TransitionChild
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="bg-opacity-75 fixed inset-0 bg-gray-500 transition-opacity" />
        </TransitionChild>

        {/* Sidebar Panel */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <TransitionChild
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <DialogPanel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 sm:px-6">
                      <DialogTitle className="text-lg font-semibold text-gray-900">
                        Shopping Cart
                        {totalItems > 0 && (
                          <span className="ml-2 text-sm font-normal text-gray-500">
                            ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                          </span>
                        )}
                      </DialogTitle>
                      <button
                        type="button"
                        className="text-gray-400 transition-colors hover:text-gray-500"
                        onClick={closeSidebar}
                        aria-label="Close cart"
                      >
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Cart Contents */}
                    {items.length === 0 ? (
                      <div className="flex-1 overflow-y-auto">
                        <EmptyCart variant="sidebar" />
                      </div>
                    ) : (
                      <>
                        {/* Cart Items - Scrollable */}
                        <div className="flex-1 overflow-y-auto px-4 py-2 sm:px-6">
                          <div className="divide-y divide-gray-200">
                            {items.map((item) => (
                              <CartItem
                                key={item.variant.id}
                                item={item}
                                onIncrement={() => incrementQuantity(item.variant.id)}
                                onDecrement={() => decrementQuantity(item.variant.id)}
                                onRemove={() => removeItem(item.variant.id)}
                                variant="sidebar"
                              />
                            ))}
                          </div>
                        </div>

                        {/* Cart Summary - Fixed at bottom */}
                        <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                          <CartSummary
                            subtotal={subtotal}
                            totalItems={totalItems}
                            variant="sidebar"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
