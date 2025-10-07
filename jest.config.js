export default {
  testEnvironment: 'jsdom',
  transform: {},
  extensionsToTreatAsEsm: ['.mjs'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.mjs$': '$1',
  },
  testMatch: [
    '**/__tests__/**/*.test.mjs',
    '**/__tests__/**/*.test.js',
  ],
  collectCoverageFrom: [
    'components/**/*.mjs',
    'module/**/*.mjs',
    'utils/**/*.mjs',
    '!**/__tests__/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
