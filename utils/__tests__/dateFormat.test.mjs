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

  it('should include weekday in formatted output', () => {
    const isoDate = '2024-01-01T00:00:00.000Z';
    const formatted = formatDate(isoDate);
    
    // Should contain a weekday abbreviation
    expect(formatted).toMatch(/Mon|Tue|Wed|Thu|Fri|Sat|Sun/);
  });

  it('should handle different months correctly', () => {
    const dates = [
      '2024-01-15T00:00:00.000Z',
      '2024-06-15T00:00:00.000Z',
      '2024-12-15T00:00:00.000Z',
    ];
    
    const formatted = dates.map(formatDate);
    
    expect(formatted[0]).toMatch(/Jan/);
    expect(formatted[1]).toMatch(/Jun/);
    expect(formatted[2]).toMatch(/Dec/);
  });

  it('should format date with correct year', () => {
    const isoDate = '2023-05-20T12:00:00.000Z';
    const formatted = formatDate(isoDate);
    
    expect(formatted).toMatch(/2023/);
  });

  it('should handle edge case dates', () => {
    const leapYearDate = '2024-02-29T00:00:00.000Z';
    const formatted = formatDate(leapYearDate);
    
    expect(formatted).toMatch(/Feb/);
    expect(formatted).toMatch(/29/);
    expect(formatted).toMatch(/2024/);
  });
});
