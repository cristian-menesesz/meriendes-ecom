import React from 'react';

export default function MockImage(props: any) {
  const { fill, priority, sizes, ...rest } = props;

  // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
  return <img {...rest} priority={priority ? 'true' : undefined} />;
}
