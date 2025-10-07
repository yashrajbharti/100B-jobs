# Testing Documentation

This document describes the testing strategy, setup, and guidelines for the 100B Jobs platform.

## Table of Contents

- [Overview](#overview)
- [Testing Stack](#testing-stack)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Frontend Testing](#frontend-testing)
- [Backend Testing](#backend-testing)
- [Writing Tests](#writing-tests)
- [Code Coverage](#code-coverage)
- [CI/CD Integration](#cicd-integration)
- [Best Practices](#best-practices)

## Overview

100B Jobs uses Jest as the primary testing framework for both frontend and backend code. The testing strategy emphasizes:

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test component interactions
- **API Tests**: Test backend endpoints
- **Coverage**: Maintain >80% code coverage

## Testing Stack

### Core Framework

- **Jest**: JavaScript testing framework
- **@jest/globals**: Modern Jest API
- **jest-environment-jsdom**: Browser environment simulation
- **supertest**: HTTP assertions for API testing

### Configuration Files

- `jest.config.js`: Frontend test configuration
- `backend/jest.config.js`: Backend test configuration
- `jest.setup.js`: Global test setup

## Running Tests

### Frontend Tests

```bash
# Run all frontend tests
npm test

# Watch mode (re-runs on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run specific test file
npm test -- utils/__tests__/dateFormat.test.mjs

# Run tests matching pattern
npm test -- --testNamePattern="formatDate"
```

### Backend Tests

```bash
# Run all backend tests
cd backend
npm test

# Or from root
npm run test:backend

# Watch mode
cd backend
npm run test:watch

# Coverage
cd backend
npm run test:coverage
```

### All Tests

```bash
# Run both frontend and backend tests
npm run test:all
```

## Test Structure

### Directory Layout

```
100B-jobs/
├── utils/
│   ├── __tests__/
│   │   ├── dateFormat.test.mjs
│   │   ├── history.test.mjs
│   │   ├── count.test.mjs
│   │   └── colorMap.test.mjs
│   ├── dateFormat.mjs
│   ├── history.mjs
│   └── ...
├── components/
│   ├── __tests__/
│   │   ├── candidate-card.test.mjs
│   │   └── search-bar.test.mjs
│   └── ...
└── backend/
    ├── __tests__/
    │   └── api.test.js
    └── server.js
```

### Naming Convention

- Test files: `*.test.mjs` or `*.test.js`
- Location: `__tests__` folder next to source files
- Test name matches source file: `dateFormat.mjs` → `dateFormat.test.mjs`

## Frontend Testing

### Testing Utilities

```javascript
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
```

### DOM Setup

Jest uses jsdom to simulate browser environment:

```javascript
beforeEach(() => {
  // Set up DOM
  document.body.innerHTML = '<div id="app"></div>';
});

afterEach(() => {
  // Clean up
  document.body.innerHTML = '';
});
```

### Testing Pure Functions

Example: `utils/dateFormat.mjs`

```javascript
import { describe, it, expect } from '@jest/globals';
import { formatDate } from '../dateFormat.mjs';

describe('formatDate', () => {
  it('should format ISO date string to readable format', () => {
    const isoDate = '2024-03-15T10:30:00.000Z';
    const formatted = formatDate(isoDate);
    
    expect(formatted).toMatch(/Mar/);
    expect(formatted).toMatch(/2024/);
    expect(formatted).toMatch(/15/);
  });

  it('should handle edge case dates', () => {
    const leapYearDate = '2024-02-29T00:00:00.000Z';
    const formatted = formatDate(leapYearDate);
    
    expect(formatted).toMatch(/Feb/);
    expect(formatted).toMatch(/29/);
  });
});
```

### Testing DOM Manipulation

Example: `utils/count.mjs`

```javascript
import { describe, it, expect, beforeEach } from '@jest/globals';
import { updateCount } from '../count.mjs';

describe('updateCount', () => {
  let outputElement;

  beforeEach(() => {
    document.body.innerHTML = '<output class="count"></output>';
    outputElement = document.querySelector('output');
  });

  it('should show "Showing 0 results" when start >= end', () => {
    updateCount(100, 50, 50);
    
    expect(outputElement.textContent).toBe('Showing 0 results');
  });

  it('should show range when count is not 0', () => {
    updateCount(100, 1, 50);
    
    expect(outputElement.textContent).toBe('Showing 1-50 of 100 results');
  });
});
```

### Testing Browser APIs

Mock window objects:

```javascript
describe('history utilities', () => {
  beforeEach(() => {
    delete window.location;
    window.location = {
      pathname: '/test',
      search: '',
    };
    window.history = {
      pushState: jest.fn(),
    };
  });

  it('should add query parameter to URL', () => {
    addQueryToPage('search', 'developer');
    
    expect(window.history.pushState).toHaveBeenCalledWith(
      {},
      '',
      '/test?search=developer'
    );
  });
});
```

### Testing Web Components

```javascript
describe('SearchBar component', () => {
  let element;

  beforeEach(() => {
    // Import component
    require('../components/search-bar.mjs');
    
    // Create element
    element = document.createElement('search-bar');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it('should render shadow DOM', () => {
    expect(element.shadowRoot).toBeTruthy();
  });

  it('should have search input', () => {
    const input = element.shadowRoot.querySelector('input[type="search"]');
    expect(input).toBeTruthy();
  });

  it('should emit search event on input', (done) => {
    element.addEventListener('search', (e) => {
      expect(e.detail).toBe('test query');
      done();
    });

    const input = element.shadowRoot.querySelector('input');
    input.value = 'test query';
    input.dispatchEvent(new Event('input'));
  });
});
```

### Testing Async Functions

```javascript
describe('loadData', () => {
  it('should fetch candidates from API', async () => {
    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ data: [], length: 0 }),
      })
    );

    await loadData();

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/candidates')
    );
  });
});
```

## Backend Testing

### API Testing with Supertest

```javascript
import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import express from 'express';

describe('Backend API Endpoints', () => {
  let app;

  beforeAll(() => {
    // Set up Express app
    app = express();
    // Add routes
  });

  describe('GET /candidates', () => {
    it('should return paginated candidates', async () => {
      const response = await request(app)
        .get('/candidates')
        .query({ limit: 10, offset: 0 })
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('length');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('POST /upload', () => {
    it('should accept candidate upload', async () => {
      const candidates = [
        { index: 1, name: 'Test', email: 'test@example.com' }
      ];

      const response = await request(app)
        .post('/upload')
        .send(candidates)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('total');
    });
  });

  describe('GET /candidates/:id', () => {
    it('should return 404 for non-existent candidate', async () => {
      await request(app)
        .get('/candidates/9999')
        .expect(404);
    });
  });
});
```

### Testing File Operations

```javascript
import fs from 'fs';
import path from 'path';

describe('File operations', () => {
  const testFile = path.join(__dirname, 'test-data.json');

  afterEach(() => {
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
  });

  it('should write data to file', () => {
    const data = [{ id: 1, name: 'Test' }];
    fs.writeFileSync(testFile, JSON.stringify(data));

    expect(fs.existsSync(testFile)).toBe(true);
    
    const content = JSON.parse(fs.readFileSync(testFile, 'utf-8'));
    expect(content).toEqual(data);
  });
});
```

## Writing Tests

### AAA Pattern

Follow Arrange-Act-Assert pattern:

```javascript
it('should do something', () => {
  // Arrange: Set up test data and conditions
  const input = 'test';
  const expected = 'TEST';

  // Act: Execute the code being tested
  const result = toUpperCase(input);

  // Assert: Verify the result
  expect(result).toBe(expected);
});
```

### Test Descriptions

Use clear, descriptive test names:

```javascript
// Good
it('should return empty array when no candidates match search', () => {});
it('should format date in MM/DD/YYYY format', () => {});
it('should emit error event when API call fails', () => {});

// Bad
it('works', () => {});
it('test1', () => {});
it('should work correctly', () => {});
```

### Test Organization

Group related tests:

```javascript
describe('CandidateCard component', () => {
  describe('rendering', () => {
    it('should render with required attributes', () => {});
    it('should show top badge when data-top is set', () => {});
  });

  describe('events', () => {
    it('should navigate on click', () => {});
  });

  describe('accessibility', () => {
    it('should have proper ARIA labels', () => {});
  });
});
```

### Matchers

Common Jest matchers:

```javascript
// Equality
expect(value).toBe(expected);           // Strict equality (===)
expect(value).toEqual(expected);        // Deep equality
expect(value).toStrictEqual(expected);  // Strict deep equality

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();

// Numbers
expect(value).toBeGreaterThan(3);
expect(value).toBeGreaterThanOrEqual(3);
expect(value).toBeLessThan(5);
expect(value).toBeCloseTo(0.3);

// Strings
expect(string).toMatch(/pattern/);
expect(string).toContain('substring');

// Arrays
expect(array).toContain(item);
expect(array).toHaveLength(3);

// Objects
expect(object).toHaveProperty('key');
expect(object).toMatchObject({ key: 'value' });

// Exceptions
expect(() => fn()).toThrow();
expect(() => fn()).toThrow('error message');

// Promises
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow();
```

## Code Coverage

### Viewing Coverage

```bash
# Generate coverage report
npm run test:coverage

# Open HTML report
open coverage/index.html
```

### Coverage Thresholds

Configure in `jest.config.js`:

```javascript
module.exports = {
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Coverage Reports

- **Text**: Terminal output
- **HTML**: Detailed browser view
- **LCOV**: For CI/CD integration

## CI/CD Integration

Tests run automatically on GitHub Actions:

```yaml
# .github/workflows/ci.yml
- name: Run frontend tests
  run: npm test

- name: Run backend tests
  run: cd backend && npm test

- name: Upload coverage
  uses: codecov/codecov-action@v4
```

### Pre-commit Hooks

Add to `.husky/pre-commit`:

```bash
#!/bin/sh
npm test
```

## Best Practices

### 1. Test Behavior, Not Implementation

```javascript
// Good: Test what the function does
it('should return sorted candidates by score', () => {
  const result = sortCandidates(candidates);
  expect(result[0].score).toBeGreaterThan(result[1].score);
});

// Bad: Test how it's implemented
it('should call Array.sort', () => {
  const spy = jest.spyOn(Array.prototype, 'sort');
  sortCandidates(candidates);
  expect(spy).toHaveBeenCalled();
});
```

### 2. Keep Tests Independent

Each test should be able to run in isolation:

```javascript
describe('independent tests', () => {
  // Good: Each test sets up its own data
  it('test 1', () => {
    const data = [1, 2, 3];
    expect(sum(data)).toBe(6);
  });

  it('test 2', () => {
    const data = [4, 5, 6];
    expect(sum(data)).toBe(15);
  });
});
```

### 3. Test Edge Cases

```javascript
describe('dateFormat', () => {
  it('should handle leap year', () => {});
  it('should handle year 2000', () => {});
  it('should handle invalid date', () => {});
  it('should handle missing date', () => {});
  it('should handle future date', () => {});
});
```

### 4. Use Test Fixtures

```javascript
// fixtures/candidates.js
export const mockCandidates = [
  { id: 1, name: 'John', skills: ['JS'] },
  { id: 2, name: 'Jane', skills: ['Python'] },
];

// In test
import { mockCandidates } from './fixtures/candidates.js';
```

### 5. Mock External Dependencies

```javascript
// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: [] }),
  })
);

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;
```

### 6. Clean Up After Tests

```javascript
afterEach(() => {
  // Clear mocks
  jest.clearAllMocks();
  
  // Clean DOM
  document.body.innerHTML = '';
  
  // Reset modules
  jest.resetModules();
});
```

### 7. Test Async Code Properly

```javascript
// Use async/await
it('should load data', async () => {
  const data = await loadData();
  expect(data).toBeDefined();
});

// Or return promise
it('should load data', () => {
  return loadData().then(data => {
    expect(data).toBeDefined();
  });
});

// Use done callback for events
it('should emit event', (done) => {
  element.addEventListener('custom', () => {
    expect(true).toBe(true);
    done();
  });
  element.trigger();
});
```

### 8. Performance Testing

```javascript
it('should complete within time limit', () => {
  const start = Date.now();
  
  performExpensiveOperation();
  
  const duration = Date.now() - start;
  expect(duration).toBeLessThan(100); // 100ms
});
```

## Troubleshooting

### Common Issues

**Issue**: Tests timeout

```javascript
// Solution: Increase timeout
jest.setTimeout(10000); // 10 seconds
```

**Issue**: Module not found

```javascript
// Solution: Check jest.config.js moduleNameMapper
```

**Issue**: DOM not available

```javascript
// Solution: Use testEnvironment: 'jsdom'
```

**Issue**: Async tests don't wait

```javascript
// Solution: Use async/await or return promise
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [Supertest](https://github.com/visionmedia/supertest)
- [Web Components Testing](https://open-wc.org/docs/testing/testing-package/)
