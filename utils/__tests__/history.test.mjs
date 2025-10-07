import { describe, it, expect, beforeEach } from '@jest/globals';
import { addQueryToPage, getQueryFromPage, removeQueryFromPage } from '../history.mjs';

describe('history utilities', () => {
  beforeEach(() => {
    // Reset window.location and history for each test
    delete window.location;
    window.location = {
      pathname: '/test',
      search: '',
    };
    window.history = {
      pushState: jest.fn(),
    };
  });

  describe('addQueryToPage', () => {
    it('should add a query parameter to the URL', () => {
      addQueryToPage('search', 'developer');
      
      expect(window.history.pushState).toHaveBeenCalledWith(
        {},
        '',
        '/test?search=developer'
      );
    });

    it('should update existing query parameter', () => {
      window.location.search = '?search=old&limit=50';
      
      addQueryToPage('search', 'new');
      
      const call = window.history.pushState.mock.calls[0];
      expect(call[2]).toContain('search=new');
    });

    it('should preserve other query parameters', () => {
      window.location.search = '?limit=50&offset=0';
      
      addQueryToPage('search', 'test');
      
      const call = window.history.pushState.mock.calls[0];
      expect(call[2]).toContain('limit=50');
      expect(call[2]).toContain('offset=0');
      expect(call[2]).toContain('search=test');
    });

    it('should handle numeric values', () => {
      addQueryToPage('offset', 50);
      
      expect(window.history.pushState).toHaveBeenCalledWith(
        {},
        '',
        '/test?offset=50'
      );
    });
  });

  describe('getQueryFromPage', () => {
    it('should retrieve query parameter value', () => {
      window.location.search = '?search=developer&limit=50';
      
      const result = getQueryFromPage('search');
      
      expect(result).toBe('developer');
    });

    it('should return null for non-existent parameter', () => {
      window.location.search = '?search=developer';
      
      const result = getQueryFromPage('missing');
      
      expect(result).toBeNull();
    });

    it('should handle empty search string', () => {
      window.location.search = '';
      
      const result = getQueryFromPage('search');
      
      expect(result).toBeNull();
    });

    it('should decode URL-encoded values', () => {
      window.location.search = '?search=hello%20world';
      
      const result = getQueryFromPage('search');
      
      expect(result).toBe('hello world');
    });
  });

  describe('removeQueryFromPage', () => {
    it('should remove specified query parameter', () => {
      window.location.search = '?search=test&limit=50&offset=0';
      
      removeQueryFromPage('search');
      
      const call = window.history.pushState.mock.calls[0];
      expect(call[2]).not.toContain('search=');
      expect(call[2]).toContain('limit=50');
    });

    it('should handle removing non-existent parameter', () => {
      window.location.search = '?search=test';
      
      removeQueryFromPage('missing');
      
      const call = window.history.pushState.mock.calls[0];
      expect(call[2]).toContain('search=test');
    });

    it('should result in clean URL when last parameter removed', () => {
      window.location.search = '?search=test';
      
      removeQueryFromPage('search');
      
      const call = window.history.pushState.mock.calls[0];
      expect(call[2]).toBe('/test?');
    });

    it('should preserve pathname', () => {
      window.location.pathname = '/candidates';
      window.location.search = '?search=test';
      
      removeQueryFromPage('search');
      
      const call = window.history.pushState.mock.calls[0];
      expect(call[2]).toContain('/candidates');
    });
  });
});
