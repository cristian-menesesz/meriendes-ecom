'use client';

import { useState } from 'react';
import Image from 'next/image';

export interface ProductImage {
  url: string;
  alt: string;
}

export interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

/**
 * Product image gallery component with main display and thumbnail navigation.
 * Currently supports single image, prepared for future multiple images feature.
 * Pure presentational component optimized for Next.js Image component.
 *
 * Features:
 * - Optimized image loading with Next.js Image
 * - Thumbnail navigation (extensible for multiple images)
 * - Responsive layout
 * - Alt text for accessibility
 * - Fallback for missing images
 *
 * @param {ProductImageGalleryProps} props - Images array and product name for alt text.
 */
export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fallback for no images
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <div className="flex h-full items-center justify-center text-gray-400">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-2 text-sm">No Image Available</p>
          </div>
        </div>
      </div>
    );
  }

  const currentImage = images[selectedImageIndex];

  return (
    <div>
      {/* Main Image Display */}
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={currentImage.url}
          alt={currentImage.alt || productName}
          width={800}
          height={800}
          className="h-full w-full object-cover object-center"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnail Navigation (for future multiple images) */}
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedImageIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-md ${
                index === selectedImageIndex
                  ? 'ring-2 ring-indigo-600'
                  : 'ring-1 ring-gray-200 hover:ring-gray-300'
              } `}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image.url}
                alt={image.alt || `${productName} - Image ${index + 1}`}
                fill
                className="object-cover object-center"
                sizes="(max-width: 640px) 25vw, 12vw"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Counter (for multiple images) */}
      {images.length > 1 && (
        <div className="mt-2 text-center text-sm text-gray-600">
          {selectedImageIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
