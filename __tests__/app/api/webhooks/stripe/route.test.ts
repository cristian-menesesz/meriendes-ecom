/**
 * @jest-environment node
 */
import { POST } from '@/app/api/webhooks/stripe/route';
import { createServiceClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe/server';
import { NextRequest } from 'next/server';

// Mock dependencies
jest.mock('@/lib/supabase/server');
jest.mock('@/lib/stripe/server');

const mockSupabaseClient = {
  from: jest.fn(),
  rpc: jest.fn(),
};

const mockStripeWebhooks = {
  constructEvent: jest.fn(),
};

describe('Stripe Webhook Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mocks - use createServiceClient which is what the webhook uses
    (createServiceClient as jest.Mock).mockReturnValue(mockSupabaseClient);
    (stripe as any).webhooks = mockStripeWebhooks;

    // Mock environment variable
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_secret';
  });

  describe('Signature Verification', () => {
    it('should return 400 if signature header is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toBe('Missing signature');
    });

    it('should return error if webhook secret is not configured', async () => {
      delete process.env.STRIPE_WEBHOOK_SECRET;

      const request = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'test_signature',
        },
        body: JSON.stringify({}),
      });

      const response = await POST(request);

      // When secret is missing, Stripe's constructEvent throws and catches error
      // The handler returns either 400 (verification failed) or 500 (general error)
      expect(response.status).toBeGreaterThanOrEqual(400);
      const body = await response.json();
      expect(body.error).toBeTruthy();

      // Restore for other tests
      process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_secret';
    });

    it('should return 400 if signature verification fails', async () => {
      mockStripeWebhooks.constructEvent.mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      const request = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'invalid_signature',
        },
        body: JSON.stringify({}),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toContain('Webhook signature verification failed');
    });

    it('should verify signature with correct parameters', async () => {
      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_123',
            payment_status: 'paid',
            metadata: { order_id: 'order_123' },
            payment_intent: 'pi_123',
            customer: 'cus_123',
            amount_total: 5000,
            currency: 'usd',
          },
        },
      };

      mockStripeWebhooks.constructEvent.mockReturnValue(mockEvent);

      // Mock successful database operations
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 'order_123', status: 'draft' },
              error: null,
            }),
          }),
        }),
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            error: null,
          }),
        }),
        insert: jest.fn().mockResolvedValue({
          error: null,
        }),
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            error: null,
          }),
        }),
      });

      mockSupabaseClient.rpc.mockResolvedValue({ error: null });

      const requestBody = JSON.stringify({ type: 'test' });
      const request = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'test_signature',
        },
        body: requestBody,
      });

      await POST(request);

      expect(mockStripeWebhooks.constructEvent).toHaveBeenCalledWith(
        requestBody,
        'test_signature',
        'whsec_test_secret'
      );
    });
  });

  describe('Event Filtering', () => {
    it('should return 200 for non-checkout.session.completed events', async () => {
      const mockEvent = {
        type: 'payment_intent.succeeded',
        data: { object: {} },
      };

      mockStripeWebhooks.constructEvent.mockReturnValue(mockEvent);

      const request = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'test_signature',
        },
        body: JSON.stringify({}),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.received).toBe(true);
    });

    it('should process checkout.session.completed events', async () => {
      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_123',
            payment_status: 'paid',
            metadata: { order_id: 'order_123' },
            payment_intent: 'pi_123',
            customer: 'cus_123',
            amount_total: 5000,
            currency: 'usd',
          },
        },
      };

      mockStripeWebhooks.constructEvent.mockReturnValue(mockEvent);

      // Mock successful database operations with proper method chaining
      const mockFrom = jest.fn();
      mockSupabaseClient.from = mockFrom;

      // First call: orders.select().eq().single() - fetch order
      mockFrom.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 'order_123', status: 'draft' },
              error: null,
            }),
          }),
        }),
      });

      // Second call: orders.update().eq() - update order status
      mockFrom.mockReturnValueOnce({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            error: null,
          }),
        }),
      });

      // Third call: payments.insert() - create payment record
      mockFrom.mockReturnValueOnce({
        insert: jest.fn().mockResolvedValue({
          error: null,
        }),
      });

      // Fourth call: order_items.select().eq() - fetch order items
      mockFrom.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: [{ variant_id: 'variant_1', quantity: 2 }],
            error: null,
          }),
        }),
      });

      // Fifth call: inventory_reservations.delete().eq() - delete reservations
      mockFrom.mockReturnValueOnce({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            error: null,
          }),
        }),
      });

      mockSupabaseClient.rpc.mockResolvedValue({ error: null });

      const request = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'test_signature',
        },
        body: JSON.stringify({}),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
    });

    it('should return 200 and skip fulfillment if payment_status is not paid', async () => {
      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_123',
            payment_status: 'unpaid',
            metadata: { order_id: 'order_123' },
          },
        },
      };

      mockStripeWebhooks.constructEvent.mockReturnValue(mockEvent);

      const request = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'test_signature',
        },
        body: JSON.stringify({}),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.received).toBe(true);
    });

    it('should return 400 if order_id is missing from metadata', async () => {
      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_123',
            payment_status: 'paid',
            metadata: {},
          },
        },
      };

      mockStripeWebhooks.constructEvent.mockReturnValue(mockEvent);

      const request = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'test_signature',
        },
        body: JSON.stringify({}),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toContain('Missing order_id in metadata');
    });
  });

  describe('Idempotency', () => {
    it('should return 200 if order is already paid', async () => {
      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_123',
            payment_status: 'paid',
            metadata: { order_id: 'order_123' },
            payment_intent: 'pi_123',
            customer: 'cus_123',
            amount_total: 5000,
            currency: 'usd',
          },
        },
      };

      mockStripeWebhooks.constructEvent.mockReturnValue(mockEvent);

      // Mock order already paid
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 'order_123', status: 'paid' }, // Already paid
              error: null,
            }),
          }),
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'test_signature',
        },
        body: JSON.stringify({}),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.received).toBe(true);

      // Verify no update calls were made
      expect(mockSupabaseClient.from).toHaveBeenCalledTimes(1);
    });

    it('should return 200 if order is processing', async () => {
      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_123',
            payment_status: 'paid',
            metadata: { order_id: 'order_123' },
            payment_intent: 'pi_123',
            customer: 'cus_123',
            amount_total: 5000,
            currency: 'usd',
          },
        },
      };

      mockStripeWebhooks.constructEvent.mockReturnValue(mockEvent);

      // Mock order already processing
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 'order_123', status: 'processing' },
              error: null,
            }),
          }),
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'test_signature',
        },
        body: JSON.stringify({}),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
    });
  });

  describe('Order Fulfillment', () => {
    it('should update order status to paid', async () => {
      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_123',
            payment_status: 'paid',
            metadata: { order_id: 'order_123' },
            payment_intent: 'pi_123',
            customer: 'cus_123',
            amount_total: 5000,
            currency: 'usd',
          },
        },
      };

      mockStripeWebhooks.constructEvent.mockReturnValue(mockEvent);

      const mockUpdate = jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null }),
      });

      const mockFrom = jest.fn();
      mockSupabaseClient.from = mockFrom;

      // First call: Get order
      mockFrom.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 'order_123', status: 'draft' },
              error: null,
            }),
          }),
        }),
      });

      // Second call: Update order
      mockFrom.mockReturnValueOnce({
        update: mockUpdate,
      });

      // Third call: Insert payment
      mockFrom.mockReturnValueOnce({
        insert: jest.fn().mockResolvedValue({ error: null }),
      });

      // Fourth call: Get order items
      mockFrom.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: [{ variant_id: 'v1', quantity: 2 }],
            error: null,
          }),
        }),
      });

      // Fifth call: Delete reservations
      mockFrom.mockReturnValueOnce({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: null }),
        }),
      });

      mockSupabaseClient.rpc.mockResolvedValue({ error: null });

      const request = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'test_signature',
        },
        body: JSON.stringify({}),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'paid',
          payment_status: 'succeeded',
        })
      );
    });

    it('should create payment record without card details', async () => {
      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_123',
            payment_status: 'paid',
            metadata: { order_id: 'order_123' },
            payment_intent: 'pi_123',
            customer: 'cus_123',
            amount_total: 5000,
            currency: 'usd',
          },
        },
      };

      mockStripeWebhooks.constructEvent.mockReturnValue(mockEvent);

      const mockInsert = jest.fn().mockResolvedValue({ error: null });
      const mockFrom = jest.fn();
      mockSupabaseClient.from = mockFrom;

      // Mock order fetch
      mockFrom.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 'order_123', status: 'draft' },
              error: null,
            }),
          }),
        }),
      });

      // Mock order update
      mockFrom.mockReturnValueOnce({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: null }),
        }),
      });

      // Mock payment insert
      mockFrom.mockReturnValueOnce({
        insert: mockInsert,
      });

      // Mock order items fetch
      mockFrom.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: [{ variant_id: 'v1', quantity: 2 }],
            error: null,
          }),
        }),
      });

      // Mock reservation delete
      mockFrom.mockReturnValueOnce({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: null }),
        }),
      });

      mockSupabaseClient.rpc.mockResolvedValue({ error: null });

      const request = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'test_signature',
        },
        body: JSON.stringify({}),
      });

      await POST(request);

      // Verify payment record does NOT include card details
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          order_id: 'order_123',
          stripe_payment_intent_id: 'pi_123',
          stripe_customer_id: 'cus_123',
          amount: 50, // 5000 cents = 50 dollars
          currency: 'usd',
          status: 'succeeded',
          payment_method_type: 'card',
        })
      );

      // Ensure NO card details in the insert call
      const insertCall = mockInsert.mock.calls[0][0];
      expect(insertCall).not.toHaveProperty('card_brand');
      expect(insertCall).not.toHaveProperty('card_last4');
    });

    it('should call fulfill_order_inventory RPC for each item', async () => {
      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_123',
            payment_status: 'paid',
            metadata: { order_id: 'order_123' },
            payment_intent: 'pi_123',
            customer: 'cus_123',
            amount_total: 5000,
            currency: 'usd',
          },
        },
      };

      mockStripeWebhooks.constructEvent.mockReturnValue(mockEvent);

      const mockFrom = jest.fn();
      mockSupabaseClient.from = mockFrom;

      // Mock order fetch
      mockFrom.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 'order_123', status: 'draft' },
              error: null,
            }),
          }),
        }),
      });

      // Mock order update
      mockFrom.mockReturnValueOnce({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: null }),
        }),
      });

      // Mock payment insert
      mockFrom.mockReturnValueOnce({
        insert: jest.fn().mockResolvedValue({ error: null }),
      });

      // Mock order items fetch - 2 items
      mockFrom.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: [
              { variant_id: 'v1', quantity: 2 },
              { variant_id: 'v2', quantity: 1 },
            ],
            error: null,
          }),
        }),
      });

      // Mock reservation delete
      mockFrom.mockReturnValueOnce({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: null }),
        }),
      });

      mockSupabaseClient.rpc.mockResolvedValue({ error: null });

      const request = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'test_signature',
        },
        body: JSON.stringify({}),
      });

      await POST(request);

      // Verify RPC was called twice
      expect(mockSupabaseClient.rpc).toHaveBeenCalledTimes(2);
      expect(mockSupabaseClient.rpc).toHaveBeenNthCalledWith(1, 'fulfill_order_inventory', {
        p_variant_id: 'v1',
        p_quantity: 2,
      });
      expect(mockSupabaseClient.rpc).toHaveBeenNthCalledWith(2, 'fulfill_order_inventory', {
        p_variant_id: 'v2',
        p_quantity: 1,
      });
    });

    it('should delete inventory reservations after fulfillment', async () => {
      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_123',
            payment_status: 'paid',
            metadata: { order_id: 'order_123' },
            payment_intent: 'pi_123',
            customer: 'cus_123',
            amount_total: 5000,
            currency: 'usd',
          },
        },
      };

      mockStripeWebhooks.constructEvent.mockReturnValue(mockEvent);

      const mockDelete = jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null }),
      });

      const mockFrom = jest.fn();
      mockSupabaseClient.from = mockFrom;

      // Mock all database calls
      mockFrom.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 'order_123', status: 'draft' },
              error: null,
            }),
          }),
        }),
      });

      mockFrom.mockReturnValueOnce({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: null }),
        }),
      });

      mockFrom.mockReturnValueOnce({
        insert: jest.fn().mockResolvedValue({ error: null }),
      });

      mockFrom.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: [{ variant_id: 'v1', quantity: 2 }],
            error: null,
          }),
        }),
      });

      // Last call: Delete reservations
      mockFrom.mockReturnValueOnce({
        delete: mockDelete,
      });

      mockSupabaseClient.rpc.mockResolvedValue({ error: null });

      const request = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'test_signature',
        },
        body: JSON.stringify({}),
      });

      await POST(request);

      expect(mockDelete).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should return 500 on database errors', async () => {
      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_123',
            payment_status: 'paid',
            metadata: { order_id: 'order_123' },
            payment_intent: 'pi_123',
            customer: 'cus_123',
            amount_total: 5000,
            currency: 'usd',
          },
        },
      };

      mockStripeWebhooks.constructEvent.mockReturnValue(mockEvent);

      // Mock database error
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database error' },
            }),
          }),
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'test_signature',
        },
        body: JSON.stringify({}),
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
      const body = await response.json();
      expect(body.error).toContain('Failed to fetch order');
    });

    it('should handle missing order gracefully', async () => {
      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_123',
            payment_status: 'paid',
            metadata: { order_id: 'nonexistent_order' },
            payment_intent: 'pi_123',
            customer: 'cus_123',
            amount_total: 5000,
            currency: 'usd',
          },
        },
      };

      mockStripeWebhooks.constructEvent.mockReturnValue(mockEvent);

      // Mock order not found
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { code: 'PGRST116' }, // Not found error
            }),
          }),
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'test_signature',
        },
        body: JSON.stringify({}),
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
    });
  });
});
