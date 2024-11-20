module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // collectCoverage: true,
  collectCoverageFrom: [
    'src/controllers/**/*.ts',
    '!src/controllers/**/*LoginController.ts',
    '!src/controllers/**/productsController.ts',
    '!src/controllers/**/userRestoController.ts',
    '!src/controllers/**/imageController.ts',
    '!src/index.ts',
    'src/models/**/*.ts',
    // 'src/**/*.ts', // Specify the files to include in coverage (all TypeScript files in src folder)
    '!src/**/*.d.ts', // Exclude TypeScript definition files from coverage
    '!src/types/**', // Ignore specific folders or files
  ],
  coverageDirectory: 'coverage', // Directory where coverage reports are saved
  coverageReporters: ['html', 'text', 'text-summary'], // Generate HTML and text reports
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
