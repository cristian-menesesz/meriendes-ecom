import React from 'react';
import { render, screen } from '@testing-library/react';
import { CartSummary } from '@/components/cart/CartSummary';
import { formatCurrency } from '@/lib/utils/currency';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('CartSummary', () => {
  describe('rendering', () => {
    it('renders order summary title', () => {
      render(<CartSummary subtotal={100} totalItems={5} variant="page" />);

      expect(screen.getByText(/order summary/i)).toBeInTheDocument();
    });

    it('displays correct item count', () => {
      render(<CartSummary subtotal={100} totalItems={3} variant="sidebar" />);

      expect(screen.getByText(/Items \(3\)/i)).toBeInTheDocument();
    });

    it('displays singular form for 1 item', () => {
      render(<CartSummary subtotal={29.99} totalItems={1} variant="page" />);

      expect(screen.getByText(/Items \(1\)/i)).toBeInTheDocument();
    });

    it('displays formatted subtotal', () => {
      render(<CartSummary subtotal={129.99} totalItems={4} variant="sidebar" />);

      expect(screen.getAllByText(formatCurrency(129.99)).length).toBeGreaterThan(0);
    });

    it('renders checkout button', () => {
      render(<CartSummary subtotal={50} totalItems={2} variant="page" />);

      const checkoutButton = screen.getByRole('button', {
        name: /proceed to checkout/i,
      });
      expect(checkoutButton).toBeInTheDocument();
      expect(checkoutButton.closest('a')).toHaveAttribute('href', '/checkout');
    });
  });

  describe('sidebar variant', () => {
    it('renders continue shopping button', () => {
      render(<CartSummary subtotal={75} totalItems={3} variant="sidebar" />);

      const continueButton = screen.getByRole('button', {
        name: /continue shopping/i,
      });
      expect(continueButton).toBeInTheDocument();
      expect(continueButton.closest('a')).toHaveAttribute('href', '/products');
    });

    it('renders view full cart link', () => {
      render(<CartSummary subtotal={100} totalItems={5} variant="sidebar" />);

      const viewCartLink = screen.getByRole('link', { name: /view full cart/i });
      expect(viewCartLink).toBeInTheDocument();
      expect(viewCartLink).toHaveAttribute('href', '/cart');
    });

    it('does not show shipping notice', () => {
      render(<CartSummary subtotal={50} totalItems={2} variant="sidebar" />);

      expect(
        screen.queryByText(/shipping and taxes calculated at checkout/i)
      ).not.toBeInTheDocument();
    });

    it('renders security badge', () => {
      render(<CartSummary subtotal={100} totalItems={4} variant="sidebar" />);

      expect(screen.getByText(/secure checkout/i)).toBeInTheDocument();
    });
  });

  describe('page variant', () => {
    it('does not render continue shopping button', () => {
      render(<CartSummary subtotal={75} totalItems={3} variant="page" />);

      expect(screen.queryByRole('button', { name: /continue shopping/i })).not.toBeInTheDocument();
    });

    it('does not render view full cart link', () => {
      render(<CartSummary subtotal={100} totalItems={5} variant="page" />);

      expect(screen.queryByRole('link', { name: /view full cart/i })).not.toBeInTheDocument();
    });

    it('shows shipping notice', () => {
      render(<CartSummary subtotal={50} totalItems={2} variant="page" />);

      expect(screen.getByText(/shipping and taxes calculated at checkout/i)).toBeInTheDocument();
    });

    it('renders security badge', () => {
      render(<CartSummary subtotal={100} totalItems={4} variant="page" />);

      expect(screen.getByText(/secure checkout/i)).toBeInTheDocument();
    });

    it('shows continue shopping link at bottom', () => {
      render(<CartSummary subtotal={100} totalItems={5} variant="page" />);

      const continueLink = screen.getByRole('link', { name: /continue shopping/i });
      expect(continueLink).toBeInTheDocument();
      expect(continueLink).toHaveAttribute('href', '/products');
    });
  });

  describe('subtotal calculations', () => {
    it('handles zero subtotal', () => {
      render(<CartSummary subtotal={0} totalItems={0} variant="page" />);

      expect(screen.getAllByText(formatCurrency(0)).length).toBeGreaterThan(0);
    });

    it('handles decimal subtotals', () => {
      render(<CartSummary subtotal={99.99} totalItems={3} variant="sidebar" />);

      expect(screen.getAllByText(formatCurrency(99.99)).length).toBeGreaterThan(0);
    });

    it('handles large subtotals', () => {
      render(<CartSummary subtotal={9999.99} totalItems={100} variant="page" />);

      expect(screen.getAllByText(formatCurrency(9999.99)).length).toBeGreaterThan(0);
    });

    it('formats currency correctly', () => {
      render(<CartSummary subtotal={1234.56} totalItems={10} variant="sidebar" />);

      const formattedValue = formatCurrency(1234.56);
      expect(screen.getAllByText(formattedValue).length).toBeGreaterThan(0);
    });
  });

  describe('item count display', () => {
    it('displays correct count for multiple items', () => {
      render(<CartSummary subtotal={150} totalItems={7} variant="page" />);

      expect(screen.getByText(/Items \(7\)/i)).toBeInTheDocument();
    });

    it('displays count for 1 item', () => {
      render(<CartSummary subtotal={29.99} totalItems={1} variant="sidebar" />);

      expect(screen.getByText(/Items \(1\)/i)).toBeInTheDocument();
    });

    it('handles large item counts', () => {
      render(<CartSummary subtotal={2999.99} totalItems={150} variant="page" />);

      expect(screen.getByText(/Items \(150\)/i)).toBeInTheDocument();
    });
  });

  describe('checkout button', () => {
    it('links to checkout page', () => {
      render(<CartSummary subtotal={100} totalItems={5} variant="sidebar" />);

      const checkoutButton = screen.getByRole('button', {
        name: /checkout/i,
      });
      expect(checkoutButton).toBeInTheDocument();
      expect(checkoutButton.closest('a')).toHaveAttribute('href', '/checkout');
    });

    it('has primary button styling', () => {
      render(<CartSummary subtotal={50} totalItems={2} variant="page" />);

      const checkoutButton = screen.getByRole('button', {
        name: /proceed to checkout/i,
      });
      expect(checkoutButton.className).toContain('w-full');
    });

    it('is keyboard accessible', () => {
      render(<CartSummary subtotal={75} totalItems={3} variant="sidebar" />);

      const checkoutLink = screen
        .getByRole('button', {
          name: /checkout/i,
        })
        .closest('a');
      expect(checkoutLink?.tagName).toBe('A');
    });
  });

  describe('navigation links', () => {
    it('continue shopping links to products page (sidebar)', () => {
      render(<CartSummary subtotal={100} totalItems={5} variant="sidebar" />);

      const continueButton = screen.getByRole('button', {
        name: /continue shopping/i,
      });
      expect(continueButton.closest('a')).toHaveAttribute('href', '/products');
    });

    it('view full cart links to cart page (sidebar)', () => {
      render(<CartSummary subtotal={100} totalItems={5} variant="sidebar" />);

      const viewCartLink = screen.getByRole('link', { name: /view full cart/i });
      expect(viewCartLink).toHaveAttribute('href', '/cart');
    });
  });

  describe('security badge', () => {
    it('displays security badge in both variants', () => {
      const { rerender } = render(<CartSummary subtotal={100} totalItems={5} variant="sidebar" />);

      expect(screen.getByText(/secure checkout/i)).toBeInTheDocument();

      rerender(<CartSummary subtotal={100} totalItems={5} variant="page" />);

      expect(screen.getByText(/secure checkout/i)).toBeInTheDocument();
    });

    it('renders shield icon', () => {
      const { container } = render(<CartSummary subtotal={100} totalItems={5} variant="page" />);

      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('layout and styling', () => {
    it('has proper container structure', () => {
      const { container } = render(<CartSummary subtotal={100} totalItems={5} variant="page" />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('rounded-lg');
    });

    it('applies border styling for page variant', () => {
      const { container } = render(<CartSummary subtotal={50} totalItems={2} variant="page" />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('border');
    });

    it('has proper spacing', () => {
      const { container } = render(<CartSummary subtotal={75} totalItems={3} variant="page" />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('p-6');
    });
  });

  describe('accessibility', () => {
    it('has semantic heading', () => {
      render(<CartSummary subtotal={100} totalItems={5} variant="page" />);

      const heading = screen.getByText(/order summary/i);
      expect(heading.tagName).toBe('H2');
    });

    it('all links are keyboard accessible', () => {
      render(<CartSummary subtotal={100} totalItems={5} variant="sidebar" />);

      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        expect(link.tagName).toBe('A');
      });
    });

    it('provides clear link text', () => {
      render(<CartSummary subtotal={100} totalItems={5} variant="sidebar" />);

      expect(screen.getByRole('button', { name: /checkout/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /continue shopping/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /view full cart/i })).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles zero items', () => {
      render(<CartSummary subtotal={0} totalItems={0} variant="page" />);

      expect(screen.getByText(/Items \(0\)/i)).toBeInTheDocument();
      expect(screen.getAllByText(formatCurrency(0)).length).toBeGreaterThan(0);
    });

    it('handles very large numbers', () => {
      render(<CartSummary subtotal={99999.99} totalItems={999} variant="sidebar" />);

      expect(screen.getByText(/Items \(999\)/i)).toBeInTheDocument();
      expect(screen.getAllByText(formatCurrency(99999.99)).length).toBeGreaterThan(0);
    });

    it('handles decimal places correctly', () => {
      render(<CartSummary subtotal={19.95} totalItems={2} variant="page" />);

      expect(screen.getAllByText(formatCurrency(19.95)).length).toBeGreaterThan(0);
    });
  });

  describe('responsive behavior', () => {
    it('checkout button spans full width', () => {
      render(<CartSummary subtotal={100} totalItems={5} variant="page" />);

      const checkoutButton = screen.getByRole('button', {
        name: /proceed to checkout/i,
      });
      expect(checkoutButton.className).toContain('w-full');
    });

    it('continue shopping button spans full width (sidebar)', () => {
      render(<CartSummary subtotal={100} totalItems={5} variant="sidebar" />);

      const continueButton = screen.getByRole('button', {
        name: /continue shopping/i,
      });
      expect(continueButton.className).toContain('w-full');
    });
  });

  describe('conditional rendering', () => {
    it('sidebar shows continue shopping and view cart', () => {
      render(<CartSummary subtotal={100} totalItems={5} variant="sidebar" />);

      expect(screen.getByRole('button', { name: /continue shopping/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /view full cart/i })).toBeInTheDocument();
      expect(
        screen.queryByText(/shipping and taxes calculated at checkout/i)
      ).not.toBeInTheDocument();
    });

    it('page shows shipping notice but not sidebar-specific elements', () => {
      render(<CartSummary subtotal={100} totalItems={5} variant="page" />);

      expect(screen.getByText(/shipping and taxes calculated at checkout/i)).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /^continue shopping$/i })
      ).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /view full cart/i })).not.toBeInTheDocument();
    });
  });
});
