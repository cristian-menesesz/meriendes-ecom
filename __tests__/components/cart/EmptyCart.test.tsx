import React from 'react';
import { render, screen } from '@testing-library/react';
import { EmptyCart } from '@/components/cart/EmptyCart';

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('EmptyCart', () => {
  describe('sidebar variant', () => {
    it('renders empty state with correct messaging', () => {
      render(<EmptyCart variant="sidebar" />);

      expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
      expect(screen.getByText(/add items to get started/i)).toBeInTheDocument();
    });

    it('renders shopping bag icon', () => {
      const { container } = render(<EmptyCart variant="sidebar" />);

      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('renders continue shopping button', () => {
      render(<EmptyCart variant="sidebar" />);

      const link = screen.getByRole('link', { name: /continue shopping/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/products');
    });

    it('applies compact sizing for sidebar', () => {
      const { container } = render(<EmptyCart variant="sidebar" />);

      // Check for sidebar-specific classes (smaller icon, compact padding)
      const icon = container.querySelector('svg');
      expect(icon).toHaveClass('h-16', 'w-16');

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('py-12');
    });
  });

  describe('page variant', () => {
    it('renders empty state with correct messaging', () => {
      render(<EmptyCart variant="page" />);

      expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
      expect(
        screen.getByText(/looks like you haven't added anything to your cart yet/i)
      ).toBeInTheDocument();
    });

    it('renders shopping bag icon', () => {
      const { container } = render(<EmptyCart variant="page" />);

      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('renders continue shopping button', () => {
      render(<EmptyCart variant="page" />);

      const link = screen.getByRole('link', { name: /continue shopping/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/products');
    });

    it('applies larger sizing for page', () => {
      const { container } = render(<EmptyCart variant="page" />);

      // Check for page-specific classes (larger icon, more padding)
      const icon = container.querySelector('svg');
      expect(icon).toHaveClass('h-24', 'w-24');

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('py-16');
    });
  });

  describe('visual elements', () => {
    it('renders shopping bag icon with correct styling', () => {
      const { container } = render(<EmptyCart variant="sidebar" />);

      const icon = container.querySelector('svg');
      expect(icon).toHaveClass('text-gray-300');
    });

    it('renders title as heading', () => {
      render(<EmptyCart variant="sidebar" />);

      const title = screen.getByText(/your cart is empty/i);
      expect(title.tagName).toBe('H3');
    });

    it('renders description text', () => {
      render(<EmptyCart variant="sidebar" />);

      const description = screen.getByText(/add items to get started/i);
      expect(description.tagName).toBe('P');
    });
  });

  describe('button styling', () => {
    it('renders button with primary variant', () => {
      render(<EmptyCart variant="sidebar" />);

      const link = screen.getByRole('link', { name: /continue shopping/i });
      const button = link.querySelector('button');
      expect(button).toBeInTheDocument();
      expect(button?.className).toContain('bg-black');
    });

    it('button links to products page', () => {
      render(<EmptyCart variant="page" />);

      const link = screen.getByRole('link', { name: /continue shopping/i });
      expect(link).toHaveAttribute('href', '/products');
    });
  });

  describe('variant differences', () => {
    it('sidebar variant has compact spacing', () => {
      const { container } = render(<EmptyCart variant="sidebar" />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('py-12');
    });

    it('page variant has generous spacing', () => {
      const { container } = render(<EmptyCart variant="page" />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('py-16');
    });

    it('sidebar variant uses smaller icon', () => {
      const { container } = render(<EmptyCart variant="sidebar" />);

      const icon = container.querySelector('svg');
      expect(icon).toHaveClass('h-16', 'w-16');
    });

    it('page variant uses larger icon', () => {
      const { container } = render(<EmptyCart variant="page" />);

      const icon = container.querySelector('svg');
      expect(icon).toHaveClass('h-24', 'w-24');
    });

    it('sidebar variant has different description', () => {
      render(<EmptyCart variant="sidebar" />);

      expect(screen.getByText(/add items to get started/i)).toBeInTheDocument();
      expect(
        screen.queryByText(/looks like you haven't added anything to your cart yet/i)
      ).not.toBeInTheDocument();
    });

    it('page variant has different description', () => {
      render(<EmptyCart variant="page" />);

      expect(
        screen.getByText(/looks like you haven't added anything to your cart yet/i)
      ).toBeInTheDocument();
      expect(screen.queryByText(/add items to get started/i)).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('uses semantic HTML structure', () => {
      render(<EmptyCart variant="sidebar" />);

      const heading = screen.getByText(/your cart is empty/i);
      expect(heading.tagName).toBe('H3');
    });

    it('button is keyboard accessible', () => {
      render(<EmptyCart variant="sidebar" />);

      const link = screen.getByRole('link', { name: /continue shopping/i });
      expect(link).toBeInTheDocument();
      expect(link.tagName).toBe('A');
    });

    it('icon is properly hidden from screen readers', () => {
      const { container } = render(<EmptyCart variant="sidebar" />);

      const icon = container.querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('layout', () => {
    it('centers content', () => {
      const { container } = render(<EmptyCart variant="sidebar" />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('items-center', 'justify-center');
    });

    it('uses flexbox layout', () => {
      const { container } = render(<EmptyCart variant="sidebar" />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('flex', 'flex-col');
    });
  });
});
