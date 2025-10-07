import { describe, it, expect, beforeEach } from '@jest/globals';
import { updateCount } from '../count.mjs';

describe('updateCount', () => {
  let outputElement;

  beforeEach(() => {
    // Create a mock output element
    document.body.innerHTML = '<output class="count"></output>';
    outputElement = document.querySelector('output');
  });

  it('should show "Showing 0 results" when start >= end', () => {
    updateCount(100, 50, 50);
    
    expect(outputElement.textContent).toBe('Showing 0 results');
  });

  it('should show range when count is not 0 and start < end', () => {
    updateCount(100, 1, 50);
    
    expect(outputElement.textContent).toBe('Showing 1-50 of 100 results');
  });

  it('should show total count when count is 0', () => {
    updateCount(0, 0, 0);
    
    expect(outputElement.textContent).toBe('Showing 0 results');
  });

  it('should handle single result correctly', () => {
    updateCount(1, 1, 1);
    
    expect(outputElement.textContent).toBe('Showing 0 results');
  });

  it('should handle partial page results', () => {
    updateCount(75, 51, 75);
    
    expect(outputElement.textContent).toBe('Showing 51-75 of 75 results');
  });

  it('should handle first page results', () => {
    updateCount(200, 1, 50);
    
    expect(outputElement.textContent).toBe('Showing 1-50 of 200 results');
  });

  it('should handle large numbers correctly', () => {
    updateCount(10000, 9951, 10000);
    
    expect(outputElement.textContent).toBe('Showing 9951-10000 of 10000 results');
  });
});
