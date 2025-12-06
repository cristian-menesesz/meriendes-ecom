import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductImageGallery } from '@/components/products/ProductImageGallery';

describe('ProductImageGallery', () => {
  const mockSingleImage = [{ url: 'https://example.com/product.jpg', alt: 'Product image' }];

  const mockMultipleImages = [
    { url: 'https://example.com/product-1.jpg', alt: 'Product view 1' },
    { url: 'https://example.com/product-2.jpg', alt: 'Product view 2' },
    { url: 'https://example.com/product-3.jpg', alt: 'Product view 3' },
    { url: 'https://example.com/product-4.jpg', alt: 'Product view 4' },
  ];

  describe('Rendering - Single Image', () => {
    it('renders a single product image', () => {
      render(<ProductImageGallery images={mockSingleImage} productName="Test Product" />);

      const image = screen.getByRole('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', expect.stringContaining('product.jpg'));
      expect(image).toHaveAttribute('alt', 'Product image');
    });

    it('uses priority loading for the main image', () => {
      render(<ProductImageGallery images={mockSingleImage} productName="Test Product" />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('data-priority', 'true');
    });

    it('does not show thumbnail navigation for single image', () => {
      render(<ProductImageGallery images={mockSingleImage} productName="Test Product" />);

      const thumbnailButtons = screen.queryAllByRole('button', { name: /view image/i });
      expect(thumbnailButtons).toHaveLength(0);
    });

    it('does not show image counter for single image', () => {
      render(<ProductImageGallery images={mockSingleImage} productName="Test Product" />);

      expect(screen.queryByText('1 / 1')).not.toBeInTheDocument();
    });
  });

  describe('Rendering - Multiple Images', () => {
    it('renders the first image by default', () => {
      render(<ProductImageGallery images={mockMultipleImages} productName="Test Product" />);

      // Note: Next.js Image mock uses data-src
      const images = screen.getAllByRole('img');
      const mainImage = images[0];
      expect(mainImage).toHaveAttribute('src', expect.stringContaining('product-1.jpg'));
    });

    it('shows thumbnail navigation for multiple images', () => {
      render(<ProductImageGallery images={mockMultipleImages} productName="Test Product" />);

      const thumbnailButtons = screen.getAllByRole('button', { name: /view image/i });
      expect(thumbnailButtons).toHaveLength(4);
    });

    it('displays image counter', () => {
      render(<ProductImageGallery images={mockMultipleImages} productName="Test Product" />);

      expect(screen.getByText('1 / 4')).toBeInTheDocument();
    });

    it('renders all thumbnails', () => {
      render(<ProductImageGallery images={mockMultipleImages} productName="Test Product" />);

      // Main image + 4 thumbnails = 5 images
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(5);
    });
  });

  describe('Image Switching', () => {
    it('switches to the clicked thumbnail image', async () => {
      const user = userEvent.setup();
      render(<ProductImageGallery images={mockMultipleImages} productName="Test Product" />);

      // Click the second thumbnail (index 1)
      const thumbnailButtons = screen.getAllByRole('button', { name: /view image/i });
      await user.click(thumbnailButtons[1]);

      // Counter should update
      expect(screen.getByText('2 / 4')).toBeInTheDocument();
    });

    it('highlights the selected thumbnail', async () => {
      const user = userEvent.setup();
      render(<ProductImageGallery images={mockMultipleImages} productName="Test Product" />);

      const thumbnailButtons = screen.getAllByRole('button', { name: /view image/i });

      // First thumbnail should be highlighted initially
      expect(thumbnailButtons[0]).toHaveClass('ring-2', 'ring-indigo-600');

      // Click second thumbnail
      await user.click(thumbnailButtons[1]);

      // Second thumbnail should now be highlighted
      expect(thumbnailButtons[1]).toHaveClass('ring-2', 'ring-indigo-600');
      expect(thumbnailButtons[0]).not.toHaveClass('ring-2', 'ring-indigo-600');
    });

    it('updates counter when switching images', async () => {
      const user = userEvent.setup();
      render(<ProductImageGallery images={mockMultipleImages} productName="Test Product" />);

      const thumbnailButtons = screen.getAllByRole('button', { name: /view image/i });

      expect(screen.getByText('1 / 4')).toBeInTheDocument();

      await user.click(thumbnailButtons[2]);
      expect(screen.getByText('3 / 4')).toBeInTheDocument();

      await user.click(thumbnailButtons[3]);
      expect(screen.getByText('4 / 4')).toBeInTheDocument();
    });
  });

  describe('Fallback - No Images', () => {
    it('renders fallback UI when no images provided', () => {
      render(<ProductImageGallery images={[]} productName="Test Product" />);

      expect(screen.getByText('No Image Available')).toBeInTheDocument();
    });

    it('renders fallback icon when no images provided', () => {
      const { container } = render(<ProductImageGallery images={[]} productName="Test Product" />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('does not render thumbnails when no images provided', () => {
      render(<ProductImageGallery images={[]} productName="Test Product" />);

      const thumbnailButtons = screen.queryAllByRole('button', { name: /view image/i });
      expect(thumbnailButtons).toHaveLength(0);
    });
  });

  describe('Alt Text Handling', () => {
    it('uses provided alt text for images', () => {
      render(<ProductImageGallery images={mockSingleImage} productName="Test Product" />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'Product image');
    });

    it('falls back to product name when alt text is not provided', () => {
      const imageWithoutAlt = [{ url: 'https://example.com/product.jpg', alt: '' }];
      render(<ProductImageGallery images={imageWithoutAlt} productName="Test Product" />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'Test Product');
    });

    it('generates descriptive alt text for thumbnails', () => {
      const imagesWithoutAlt = mockMultipleImages.map((img) => ({
        ...img,
        alt: '',
      }));

      render(<ProductImageGallery images={imagesWithoutAlt} productName="Test Product" />);

      // Check thumbnails have descriptive alt text
      const images = screen.getAllByRole('img');
      expect(images[1]).toHaveAttribute('alt', 'Test Product - Image 1');
      expect(images[2]).toHaveAttribute('alt', 'Test Product - Image 2');
    });
  });

  describe('Accessibility', () => {
    it('provides accessible button labels for thumbnails', () => {
      render(<ProductImageGallery images={mockMultipleImages} productName="Test Product" />);

      expect(screen.getByRole('button', { name: 'View image 1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'View image 2' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'View image 3' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'View image 4' })).toBeInTheDocument();
    });

    it('uses button elements for thumbnail navigation', () => {
      render(<ProductImageGallery images={mockMultipleImages} productName="Test Product" />);

      const thumbnailButtons = screen.getAllByRole('button', { name: /view image/i });
      thumbnailButtons.forEach((button) => {
        expect(button).toHaveAttribute('type', 'button');
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles empty images array', () => {
      render(<ProductImageGallery images={[]} productName="Test Product" />);

      expect(screen.getByText('No Image Available')).toBeInTheDocument();
    });

    it('handles undefined images', () => {
      // @ts-expect-error - Testing edge case
      render(<ProductImageGallery images={undefined} productName="Test Product" />);

      expect(screen.getByText('No Image Available')).toBeInTheDocument();
    });

    it('maintains state when clicking the same thumbnail', async () => {
      const user = userEvent.setup();
      render(<ProductImageGallery images={mockMultipleImages} productName="Test Product" />);

      const thumbnailButtons = screen.getAllByRole('button', { name: /view image/i });

      await user.click(thumbnailButtons[1]);
      expect(screen.getByText('2 / 4')).toBeInTheDocument();

      await user.click(thumbnailButtons[1]);
      expect(screen.getByText('2 / 4')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('applies correct CSS classes for responsive layout', () => {
      const { container } = render(
        <ProductImageGallery images={mockSingleImage} productName="Test Product" />
      );

      const mainImageContainer = container.querySelector('.aspect-square');
      expect(mainImageContainer).toBeInTheDocument();
      expect(mainImageContainer).toHaveClass('w-full', 'rounded-lg');
    });

    it('uses grid layout for thumbnails', () => {
      const { container } = render(
        <ProductImageGallery images={mockMultipleImages} productName="Test Product" />
      );

      const thumbnailGrid = container.querySelector('.grid-cols-4');
      expect(thumbnailGrid).toBeInTheDocument();
    });
  });
});
