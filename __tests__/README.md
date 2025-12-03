# Product Browsing Feature - Test Suite

Comprehensive Jest test suite for the product browsing feature, covering all components, utilities, and business logic.

## Test Coverage

### Components

#### 1. **ProductCard** (`__tests__/components/products/ProductCard.test.tsx`)

- ✅ **Rendering**: Product name, image, description, links
- ✅ **Price Display**: Single price, price range, empty variants, edge cases (Infinity, NaN)
- ✅ **Stock Status**: Out of stock badge, featured badge, seasonal badge
- ✅ **Variant Information**: Multiple sizes display, variant counting
- ✅ **Quick Add Button**: Visibility, click handler, lowest price variant selection, event prevention
- ✅ **Accessibility**: Alt text, aria-labels, semantic HTML
- ✅ **Image Optimization**: Priority loading for featured products
- ✅ **Edge Cases**: Null inventory, inactive variants, long names, zero prices

**Total Tests**: 35+ test cases

#### 2. **ProductGrid** (`__tests__/components/products/ProductGrid.test.tsx`)

- ✅ **Rendering**: Multiple products, prop passing
- ✅ **Empty State**: "No products found" message
- ✅ **Grid Layout**: Responsive classes, gap spacing
- ✅ **Multiple Products**: Single, many products
- ✅ **Key Props**: Unique keys for React

**Total Tests**: 10+ test cases

#### 3. **CategoryFilter** (`__tests__/components/products/CategoryFilter.test.tsx`)

- ✅ **Rendering**: All Products link, category links, correct order
- ✅ **Link Behavior**: Correct URLs, query params, slug usage
- ✅ **Active State Styling**: Highlighting logic for selected categories
- ✅ **Accessibility**: WCAG AA contrast, hover states
- ✅ **Layout**: Flexbox, wrapping, spacing, pill styling
- ✅ **Edge Cases**: Empty categories, special characters, non-existent categories
- ✅ **Responsive Design**: Wrap behavior

**Total Tests**: 20+ test cases

#### 4. **ProductListing** (`__tests__/components/products/ProductListing.test.tsx`)

- ✅ **Rendering**: ProductGrid integration
- ✅ **Add to Cart Functionality**: Zustand integration, toast notifications
- ✅ **Container/Presenter Pattern**: Separation of concerns
- ✅ **Multiple Products**: Multiple add-to-cart actions
- ✅ **Edge Cases**: Empty products, missing variants
- ✅ **Zustand Integration**: Store usage verification

**Total Tests**: 12+ test cases

### Utilities

#### 5. **Currency Utils** (`__tests__/lib/utils/currency.test.ts`)

- ✅ **formatCurrency**: Decimal places, thousands separators, negative amounts, small amounts
- ✅ **dollarsToCents**: Conversion accuracy, Math.floor behavior, small amounts
- ✅ **centsToDollars**: Conversion accuracy, large amounts
- ✅ **Round-trip Conversions**: Accuracy validation

**Total Tests**: 15+ test cases

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (useful during development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

```
__tests__/
├── components/
│   └── products/
│       ├── ProductCard.test.tsx       # 35+ tests
│       ├── ProductGrid.test.tsx        # 10+ tests
│       ├── CategoryFilter.test.tsx     # 20+ tests
│       └── ProductListing.test.tsx     # 12+ tests
└── lib/
    └── utils/
        └── currency.test.ts            # 15+ tests
```

## Test Configuration

- **Framework**: Jest 30.x
- **Environment**: jsdom (DOM simulation)
- **Testing Library**: React Testing Library 16.x
- **Coverage Tool**: V8

### Key Configuration Files

- `jest.config.ts`: Main Jest configuration
- `jest.setup.ts`: Global test setup, mocks for Next.js modules
- `package.json`: Test scripts

## Mocking Strategy

### Global Mocks (jest.setup.ts)

1. **Next.js Router**: Mocked `next/navigation` hooks
2. **Next.js Link**: Simplified anchor element
3. **Next.js Image**: Simplified img element
4. **Environment Variables**: Supabase test credentials

### Component-Level Mocks

- **ProductGrid tests**: ProductCard component mocked
- **ProductListing tests**: ProductGrid, cart store, and toast notifications mocked

## Test Patterns

### 1. **Separation of Concerns**

Tests validate that components follow the Container/Presenter pattern:

- `ProductListing` (Container) handles business logic
- `ProductGrid` (Presenter) handles display

### 2. **Edge Case Coverage**

All tests include edge cases:

- Empty arrays
- Null/undefined values
- Invalid data
- Boundary conditions (0, Infinity, NaN)

### 3. **Accessibility Testing**

Tests verify WCAG AA compliance:

- Alt text for images
- Aria labels for buttons
- Color contrast ratios
- Keyboard navigation support

### 4. **Business Logic Validation**

Critical business rules tested:

- Price calculation with empty variants (no Infinity/NaN)
- Lowest-priced variant selection for Quick Add
- Stock status determination
- Active variant filtering

## Code Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## Key Test Scenarios

### Critical Path Testing

1. **Price Display Bug Fix**: Tests verify that `Math.min([])` edge case is handled
2. **Stock Filtering**: Tests confirm only in-stock variants show Quick Add button
3. **Variant Selection**: Tests verify lowest-priced variant is auto-selected
4. **Category Navigation**: Tests confirm URL-based filtering works correctly

### User Journey Coverage

1. **Browse Products**: User views product grid → Tests ProductGrid rendering
2. **Filter by Category**: User clicks category → Tests CategoryFilter active state
3. **Quick Add to Cart**: User clicks Quick Add → Tests ProductListing cart integration
4. **View Product Details**: User clicks product card → Tests link navigation

## Running Specific Tests

```bash
# Run tests for a specific component
npm test ProductCard

# Run tests for a specific file
npm test __tests__/components/products/ProductCard.test.tsx

# Run tests matching a pattern
npm test "price display"

# Update snapshots (if using snapshot testing)
npm test -- -u
```

## Debugging Tests

```bash
# Run tests with verbose output
npm test -- --verbose

# Run a single test file
npm test -- ProductCard.test.tsx

# Run tests in debug mode (with Node inspector)
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Best Practices Followed

1. **Descriptive Test Names**: Uses "should" statements for clarity
2. **Arrange-Act-Assert**: Clear test structure
3. **Mock Data Factories**: Reusable `createMockProduct`, `createMockVariant` functions
4. **Isolated Tests**: Each test is independent, no shared state
5. **Accessibility Focus**: Tests include a11y verification
6. **Type Safety**: Full TypeScript support in tests

## Integration with CI/CD

Add to GitHub Actions or similar CI:

```yaml
- name: Run tests
  run: npm test

- name: Generate coverage report
  run: npm run test:coverage

- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
```

## Future Test Additions

As the product browsing feature evolves, consider adding:

1. **Snapshot Tests**: For UI consistency
2. **E2E Tests**: Using Playwright for full user journeys
3. **Performance Tests**: For large product catalogs
4. **Visual Regression Tests**: For UI changes
5. **API Mocking**: For Supabase query tests

## Troubleshooting

### Common Issues

**Issue**: Tests fail with "Cannot find module '@/...'"
**Solution**: Check `moduleNameMapper` in `jest.config.ts`

**Issue**: "Window is not defined"
**Solution**: Verify `testEnvironment: 'jsdom'` in config

**Issue**: Next.js imports fail
**Solution**: Check mocks in `jest.setup.ts`

**Issue**: TypeScript errors in tests
**Solution**: Add `@types/jest` to devDependencies

## Documentation References

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Next.js Testing Guide](https://nextjs.org/docs/testing)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
