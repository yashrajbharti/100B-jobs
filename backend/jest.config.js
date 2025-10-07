export default {
  testEnvironment: 'node',
  transform: {},
  extensionsToTreatAsEsm: ['.js'],
  testMatch: [
    '**/__tests__/**/*.test.js',
  ],
  collectCoverageFrom: [
    'server.js',
    '!**/__tests__/**',
    '!**/node_modules/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};
