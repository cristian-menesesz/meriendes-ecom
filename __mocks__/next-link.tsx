import React from 'react';
import type { LinkProps } from 'next/link';

type MockLinkProps = Partial<LinkProps> & {
  children?: React.ReactNode;
  className?: string;
};

export default function MockLink({ children, href, className, ...props }: MockLinkProps) {
  return (
    <a href={href?.toString()} className={className} {...props}>
      {children}
    </a>
  );
}
