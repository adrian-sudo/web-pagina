module.exports = {
    testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
    collectCoverage: true,
    coverageReporters: ['text', 'html'],
    coverageDirectory: 'coverage',
  };