import React from 'react';
import type { ImageProps } from 'next/image';

// Mock next/image component for testing
// Renders Next.js Image props as data attributes for test assertions
export default function MockImage(props: Partial<ImageProps>) {
  const { priority, fill, src, alt, ...rest } = props;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      src={typeof src === 'string' ? src : (src as any)?.src || ''}
      alt={alt}
      data-priority={priority ? 'true' : 'false'}
      data-fill={fill ? 'true' : 'false'}
      {...rest}
    />
  );
}
