import React from 'react';
import type { ImageProps } from 'next/image';

export default function MockImage(props: Partial<ImageProps>) {
  const { priority, ...rest } = props;

  // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
  return <img {...rest} priority={priority ? 'true' : undefined} />;
}
