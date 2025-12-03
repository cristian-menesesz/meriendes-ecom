export function useRouter() {
  return {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  };
}

export function useSearchParams() {
  return new URLSearchParams();
}

export function usePathname() {
  return '/';
}
