import React from 'react';

export default function MockLink({ children, href, className, ...props }: any) {
  return (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  );
}
