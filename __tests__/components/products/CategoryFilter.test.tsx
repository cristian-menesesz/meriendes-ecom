import React from 'react';
import { render, screen } from '@testing-library/react';
import { CategoryFilter } from '@/components/products/CategoryFilter';
import type { ProductCategory } from '@/types';

const createMockCategory = (id: number, name: string, slug: string): ProductCategory => ({
  id,
  name,
  slug,
  description: null,
  displayOrder: 0,
  isActive: true,
  createdAt: new Date().toISOString(),
});

describe('CategoryFilter Component', () => {
  describe('Rendering', () => {
    it('should render "All Products" link', () => {
      render(<CategoryFilter categories={[]} />);

      expect(screen.getByText('All Products')).toBeInTheDocument();
    });

    it('should render all category links', () => {
      const categories = [
        createMockCategory(1, 'Cakes', 'cakes'),
        createMockCategory(2, 'Pastries', 'pastries'),
        createMockCategory(3, 'Cookies', 'cookies'),
      ];

      render(<CategoryFilter categories={categories} />);

      expect(screen.getByText('Cakes')).toBeInTheDocument();
      expect(screen.getByText('Pastries')).toBeInTheDocument();
      expect(screen.getByText('Cookies')).toBeInTheDocument();
    });

    it('should render category links in correct order', () => {
      const categories = [
        createMockCategory(1, 'First', 'first'),
        createMockCategory(2, 'Second', 'second'),
        createMockCategory(3, 'Third', 'third'),
      ];

      render(<CategoryFilter categories={categories} />);

      const links = screen.getAllByRole('link');
      // First link is "All Products", then categories
      expect(links[0]).toHaveTextContent('All Products');
      expect(links[1]).toHaveTextContent('First');
      expect(links[2]).toHaveTextContent('Second');
      expect(links[3]).toHaveTextContent('Third');
    });
  });

  describe('Link Behavior', () => {
    it('should link "All Products" to /products', () => {
      render(<CategoryFilter categories={[]} />);

      const link = screen.getByText('All Products').closest('a');
      expect(link).toHaveAttribute('href', '/products');
    });

    it('should link categories to /products with category query param', () => {
      const categories = [createMockCategory(1, 'Cakes', 'cakes')];

      render(<CategoryFilter categories={categories} />);

      const link = screen.getByText('Cakes').closest('a');
      expect(link).toHaveAttribute('href', '/products?category=cakes');
    });

    it('should use category slug in URL, not name', () => {
      const categories = [createMockCategory(1, 'Chocolate Cakes', 'chocolate-cakes')];

      render(<CategoryFilter categories={categories} />);

      const link = screen.getByText('Chocolate Cakes').closest('a');
      expect(link).toHaveAttribute('href', '/products?category=chocolate-cakes');
    });
  });

  describe('Active State Styling', () => {
    it('should highlight "All Products" when no category selected', () => {
      render(<CategoryFilter categories={[]} currentCategory={undefined} />);

      const link = screen.getByText('All Products').closest('a');
      expect(link).toHaveClass('bg-black', 'text-white');
      expect(link).not.toHaveClass('bg-gray-100', 'text-gray-700');
    });

    it('should not highlight "All Products" when category is selected', () => {
      const categories = [createMockCategory(1, 'Cakes', 'cakes')];

      render(<CategoryFilter categories={categories} currentCategory="cakes" />);

      const allProductsLink = screen.getByText('All Products').closest('a');
      expect(allProductsLink).toHaveClass('bg-gray-100', 'text-gray-700');
      expect(allProductsLink).not.toHaveClass('bg-black', 'text-white');
    });

    it('should highlight selected category', () => {
      const categories = [
        createMockCategory(1, 'Cakes', 'cakes'),
        createMockCategory(2, 'Pastries', 'pastries'),
      ];

      render(<CategoryFilter categories={categories} currentCategory="cakes" />);

      const cakesLink = screen.getByText('Cakes').closest('a');
      const pastriesLink = screen.getByText('Pastries').closest('a');

      expect(cakesLink).toHaveClass('bg-black', 'text-white');
      expect(pastriesLink).toHaveClass('bg-gray-100', 'text-gray-700');
    });

    it('should not highlight any category when "All Products" is selected', () => {
      const categories = [
        createMockCategory(1, 'Cakes', 'cakes'),
        createMockCategory(2, 'Pastries', 'pastries'),
      ];

      render(<CategoryFilter categories={categories} currentCategory={undefined} />);

      const cakesLink = screen.getByText('Cakes').closest('a');
      const pastriesLink = screen.getByText('Pastries').closest('a');

      expect(cakesLink).toHaveClass('bg-gray-100', 'text-gray-700');
      expect(pastriesLink).toHaveClass('bg-gray-100', 'text-gray-700');
    });
  });

  describe('Accessibility', () => {
    it('should render links with proper contrast (WCAG AA)', () => {
      const categories = [createMockCategory(1, 'Cakes', 'cakes')];

      render(<CategoryFilter categories={categories} />);

      const inactiveLink = screen.getByText('Cakes').closest('a');
      // bg-gray-100 with text-gray-700 should meet WCAG AA standards
      expect(inactiveLink).toHaveClass('text-gray-700');
    });

    it('should have hover states for inactive categories', () => {
      const categories = [createMockCategory(1, 'Cakes', 'cakes')];

      render(<CategoryFilter categories={categories} />);

      const link = screen.getByText('Cakes').closest('a');
      expect(link).toHaveClass('hover:bg-gray-200');
    });

    it('should not have hover state for active category', () => {
      const categories = [createMockCategory(1, 'Cakes', 'cakes')];

      render(<CategoryFilter categories={categories} currentCategory="cakes" />);

      const link = screen.getByText('Cakes').closest('a');
      expect(link).not.toHaveClass('hover:bg-gray-200');
    });
  });

  describe('Layout', () => {
    it('should use flexbox with wrapping', () => {
      const categories = [createMockCategory(1, 'Cakes', 'cakes')];
      const { container } = render(<CategoryFilter categories={categories} />);

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('flex', 'flex-wrap', 'gap-2');
    });

    it('should apply consistent spacing between items', () => {
      const categories = [
        createMockCategory(1, 'Cakes', 'cakes'),
        createMockCategory(2, 'Pastries', 'pastries'),
      ];
      const { container } = render(<CategoryFilter categories={categories} />);

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('gap-2');
    });

    it('should apply pill-shaped styling to links', () => {
      const categories = [createMockCategory(1, 'Cakes', 'cakes')];

      render(<CategoryFilter categories={categories} />);

      const link = screen.getByText('Cakes').closest('a');
      expect(link).toHaveClass('rounded-full', 'px-4', 'py-2');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty categories array', () => {
      render(<CategoryFilter categories={[]} />);

      // Should only show "All Products"
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(1);
      expect(links[0]).toHaveTextContent('All Products');
    });

    it('should handle single category', () => {
      const categories = [createMockCategory(1, 'Cakes', 'cakes')];

      render(<CategoryFilter categories={categories} />);

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(2); // "All Products" + 1 category
    });

    it('should handle many categories', () => {
      const categories = Array.from({ length: 10 }, (_, i) =>
        createMockCategory(i, `Category ${i}`, `category-${i}`)
      );

      render(<CategoryFilter categories={categories} />);

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(11); // "All Products" + 10 categories
    });

    it('should handle category with special characters in name', () => {
      const categories = [createMockCategory(1, 'Cakes & Pastries', 'cakes-pastries')];

      render(<CategoryFilter categories={categories} />);

      expect(screen.getByText('Cakes & Pastries')).toBeInTheDocument();
    });

    it('should handle currentCategory that does not match any category', () => {
      const categories = [createMockCategory(1, 'Cakes', 'cakes')];

      render(<CategoryFilter categories={categories} currentCategory="non-existent" />);

      // "All Products" should not be highlighted
      const allProductsLink = screen.getByText('All Products').closest('a');
      expect(allProductsLink).toHaveClass('bg-gray-100', 'text-gray-700');

      // No category should be highlighted
      const cakesLink = screen.getByText('Cakes').closest('a');
      expect(cakesLink).toHaveClass('bg-gray-100', 'text-gray-700');
    });
  });

  describe('Responsive Design', () => {
    it('should wrap categories on smaller screens', () => {
      const categories = Array.from({ length: 5 }, (_, i) =>
        createMockCategory(i, `Category ${i}`, `category-${i}`)
      );
      const { container } = render(<CategoryFilter categories={categories} />);

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('flex-wrap');
    });
  });
});
