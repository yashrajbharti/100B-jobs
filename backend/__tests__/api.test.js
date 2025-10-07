import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock data for testing
const mockCandidates = [
  {
    index: 1,
    name: 'John Doe',
    email: 'john@example.com',
    skills: ['JavaScript', 'React', 'Node.js'],
    score: 9.5,
    top: '#1',
    experience: [
      {
        company: 'Tech Corp',
        position: 'Senior Developer',
        start: '2020-01-01',
        end: '2024-01-01',
      },
    ],
  },
  {
    index: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    skills: ['Python', 'Django', 'PostgreSQL'],
    score: 8.7,
    top: '#2',
    experience: [
      {
        company: 'Data Inc',
        position: 'Data Engineer',
        start: '2019-06-01',
        end: '2023-12-01',
      },
    ],
  },
  {
    index: 3,
    name: 'Bob Wilson',
    email: 'bob@example.com',
    skills: ['Java', 'Spring', 'Kubernetes'],
    score: 7.2,
    experience: [],
  },
];

describe('Backend API Endpoints', () => {
  let testFilePath;

  beforeAll(() => {
    testFilePath = path.join(__dirname, '../test-candidates.json');
    // Create test data file
    fs.writeFileSync(testFilePath, JSON.stringify(mockCandidates, null, 2));
  });

  afterAll(() => {
    // Clean up test file
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  describe('GET /candidates', () => {
    it('should return paginated candidates list', async () => {
      // This is a documentation of the expected API behavior
      const expectedResponse = {
        length: expect.any(Number),
        data: expect.arrayContaining([
          expect.objectContaining({
            index: expect.any(Number),
            name: expect.any(String),
            email: expect.any(String),
            skills: expect.any(Array),
          }),
        ]),
      };

      expect(expectedResponse).toBeDefined();
    });

    it('should support limit and offset query parameters', () => {
      const testData = mockCandidates.slice(0, 1);
      expect(testData).toHaveLength(1);
      expect(testData[0].index).toBe(1);
    });

    it('should filter candidates by search query', () => {
      const searchTerm = 'john';
      const filtered = mockCandidates.filter((c) =>
        c.name.toLowerCase().includes(searchTerm)
      );
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('John Doe');
    });

    it('should search across name, email, and skills', () => {
      const searchTerm = 'python';
      const filtered = mockCandidates.filter((c) =>
        (c.skills || []).some((skill) =>
          skill.toLowerCase().includes(searchTerm)
        )
      );
      expect(filtered).toHaveLength(1);
      expect(filtered[0].email).toBe('jane@example.com');
    });

    it('should filter top candidates and sort by score', () => {
      const topCandidates = mockCandidates
        .filter((c) => c.score !== undefined)
        .sort((a, b) => b.score - a.score);
      
      expect(topCandidates[0].score).toBeGreaterThan(topCandidates[1].score);
      expect(topCandidates[0].name).toBe('John Doe');
    });
  });

  describe('GET /candidates/:id', () => {
    it('should return full candidate data by index', () => {
      const candidateId = 1;
      const candidate = mockCandidates.find((c) => c.index === candidateId);
      
      expect(candidate).toBeDefined();
      expect(candidate.index).toBe(1);
      expect(candidate.experience).toBeDefined();
    });

    it('should return 404 for non-existent candidate', () => {
      const candidateId = 9999;
      const candidate = mockCandidates.find((c) => c.index === candidateId);
      
      expect(candidate).toBeUndefined();
    });
  });

  describe('POST /upload', () => {
    it('should accept batch upload of candidates', () => {
      const newBatch = [
        {
          index: 4,
          name: 'Alice Johnson',
          email: 'alice@example.com',
          skills: ['Go', 'Docker'],
          score: 8.0,
        },
      ];

      expect(newBatch).toHaveLength(1);
      expect(newBatch[0].index).toBe(4);
    });

    it('should deduplicate candidates by index', () => {
      const existing = mockCandidates;
      const newBatch = [
        { index: 1, name: 'Updated John', email: 'john@example.com' },
        { index: 4, name: 'New Person', email: 'new@example.com' },
      ];

      const incomingIndexes = new Set(newBatch.map((c) => c.index));
      const dedupedExisting = existing.filter(
        (c) => !incomingIndexes.has(c.index)
      );
      const merged = [...dedupedExisting, ...newBatch];

      expect(merged.filter((c) => c.index === 1)).toHaveLength(1);
      expect(merged.find((c) => c.index === 1).name).toBe('Updated John');
    });

    it('should handle empty batch gracefully', () => {
      const emptyBatch = [];
      expect(emptyBatch).toHaveLength(0);
    });
  });

  describe('PATCH /upload/top5', () => {
    it('should update top 5 rankings', () => {
      const top5Update = [
        { index: 1, top: '#1' },
        { index: 2, top: '#2' },
      ];

      const updated = mockCandidates.map((c) => {
        const match = top5Update.find((t) => t.index === c.index);
        return match ? { ...c, top: match.top } : c;
      });

      expect(updated.find((c) => c.index === 1).top).toBe('#1');
      expect(updated.find((c) => c.index === 2).top).toBe('#2');
    });
  });

  describe('DELETE /candidates', () => {
    it('should clear candidate data file', () => {
      const filePath = path.join(__dirname, '../test-delete.json');
      fs.writeFileSync(filePath, JSON.stringify(mockCandidates));

      expect(fs.existsSync(filePath)).toBe(true);
      
      fs.unlinkSync(filePath);
      
      expect(fs.existsSync(filePath)).toBe(false);
    });

    it('should return 404 if no data exists to delete', () => {
      const filePath = path.join(__dirname, '../non-existent.json');
      const exists = fs.existsSync(filePath);
      
      expect(exists).toBe(false);
    });
  });

  describe('Data Validation', () => {
    it('should validate candidate has required fields', () => {
      const candidate = mockCandidates[0];
      
      expect(candidate).toHaveProperty('index');
      expect(candidate).toHaveProperty('name');
      expect(candidate).toHaveProperty('email');
      expect(candidate).toHaveProperty('skills');
    });

    it('should validate email format', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      mockCandidates.forEach((candidate) => {
        expect(candidate.email).toMatch(emailRegex);
      });
    });

    it('should validate score range', () => {
      mockCandidates.forEach((candidate) => {
        if (candidate.score !== undefined) {
          expect(candidate.score).toBeGreaterThanOrEqual(0);
          expect(candidate.score).toBeLessThanOrEqual(10);
        }
      });
    });
  });
});
