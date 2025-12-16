'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { createCheckoutSession } from './actions';
import { checkoutFormSchema } from '@/lib/validations/schemas';
import { calculateOrderTotal } from '@/lib/utils/checkout';
import { formatCurrency } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import type { z } from 'zod';

type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: {
      streetAddress1: '',
      streetAddress2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
      deliveryInstructions: '',
    },
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Redirect if cart is empty
  if (items.length === 0) {
    router.push('/products');
    return null;
  }

  const subtotal = getTotalPrice();
  const { taxAmount, deliveryFee, total } = calculateOrderTotal(
    subtotal,
    formData.address.state || 'CA'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFormErrors({});
    setIsSubmitting(true);

    try {
      // Client-side validation
      const validationResult = checkoutFormSchema.safeParse(formData);

      if (!validationResult.success) {
        const errors: Record<string, string> = {};
        validationResult.error.issues.forEach((err) => {
          const path = err.path.join('.');
          errors[path] = err.message;
        });
        setFormErrors(errors);
        setIsSubmitting(false);
        return;
      }

      // Call Server Action
      const result = await createCheckoutSession({
        customerInfo: validationResult.data,
        cartItems: items,
      });

      if (!result.success) {
        setError(result.error);
        setIsSubmitting(false);
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = result.sessionUrl;
    } catch (err) {
      console.error('Checkout error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1] as keyof CheckoutFormData['address'];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
    // Clear error for this field
    setFormErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column: Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Customer Information</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`mt-1 block w-full rounded-md border ${
                      formErrors.email ? 'border-red-300' : 'border-gray-300'
                    } px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                    required
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`mt-1 block w-full rounded-md border ${
                        formErrors.firstName ? 'border-red-300' : 'border-gray-300'
                      } px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                      required
                    />
                    {formErrors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`mt-1 block w-full rounded-md border ${
                        formErrors.lastName ? 'border-red-300' : 'border-gray-300'
                      } px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                      required
                    />
                    {formErrors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Delivery Address</h2>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="streetAddress1"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="streetAddress1"
                    value={formData.address.streetAddress1}
                    onChange={(e) => handleInputChange('address.streetAddress1', e.target.value)}
                    className={`mt-1 block w-full rounded-md border ${
                      formErrors['address.streetAddress1'] ? 'border-red-300' : 'border-gray-300'
                    } px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                    required
                  />
                  {formErrors['address.streetAddress1'] && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors['address.streetAddress1']}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="streetAddress2"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Apartment, Suite, etc. (Optional)
                  </label>
                  <input
                    type="text"
                    id="streetAddress2"
                    value={formData.address.streetAddress2}
                    onChange={(e) => handleInputChange('address.streetAddress2', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      value={formData.address.city}
                      onChange={(e) => handleInputChange('address.city', e.target.value)}
                      className={`mt-1 block w-full rounded-md border ${
                        formErrors['address.city'] ? 'border-red-300' : 'border-gray-300'
                      } px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                      required
                    />
                    {formErrors['address.city'] && (
                      <p className="mt-1 text-sm text-red-600">{formErrors['address.city']}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                      State *
                    </label>
                    <input
                      type="text"
                      id="state"
                      value={formData.address.state}
                      onChange={(e) => handleInputChange('address.state', e.target.value)}
                      className={`mt-1 block w-full rounded-md border ${
                        formErrors['address.state'] ? 'border-red-300' : 'border-gray-300'
                      } px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                      placeholder="CA"
                      required
                    />
                    {formErrors['address.state'] && (
                      <p className="mt-1 text-sm text-red-600">{formErrors['address.state']}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      value={formData.address.zipCode}
                      onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                      className={`mt-1 block w-full rounded-md border ${
                        formErrors['address.zipCode'] ? 'border-red-300' : 'border-gray-300'
                      } px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                      required
                    />
                    {formErrors['address.zipCode'] && (
                      <p className="mt-1 text-sm text-red-600">{formErrors['address.zipCode']}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="deliveryInstructions"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Delivery Instructions (Optional)
                  </label>
                  <textarea
                    id="deliveryInstructions"
                    value={formData.address.deliveryInstructions}
                    onChange={(e) =>
                      handleInputChange('address.deliveryInstructions', e.target.value)
                    }
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="Gate code, special instructions, etc."
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
              {isSubmitting ? (
                <>
                  <LoadingSpinner className="mr-2 h-5 w-5" />
                  Processing...
                </>
              ) : (
                `Proceed to Payment • ${formatCurrency(total)}`
              )}
            </Button>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Order Summary</h2>

            {/* Cart Items */}
            <div className="mb-4 space-y-3 border-b border-gray-200 pb-4">
              {items.map((item) => (
                <div key={item.variant.id} className="flex gap-3">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-gray-200">
                    {item.product.imageUrl && (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                      <p className="text-xs text-gray-500">{item.variant.variantName}</p>
                    </div>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity} × {formatCurrency(item.variant.price)}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(item.variant.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Breakdown */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    formatCurrency(deliveryFee)
                  )}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between text-base font-semibold text-gray-900">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {/* Free Delivery Notice */}
            {deliveryFee === 0 && (
              <div className="mt-4 rounded-md bg-green-50 p-3">
                <p className="text-sm text-green-700">🎉 You qualify for free delivery!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
