module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {

    // if your using tsconfig.paths thers is no harm in telling jest
    // '@components/(.*)$': '<rootDir>/src/components/$1',
    // '@/(.*)$': '<rootDir>/src/$1',

    // mocking assests and styling
    '^.+\\.(css|less|scss|sass)$': '<rootDir>/src/test/styleMock.js',
    // '^.+\\.(css|less|scss|sass)$': "identity-obj-proxy",
    // '^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
    //   '<rootDir>/tests/mocks/fileMock.js',
    /* mock models and services folder */
    // '(assets|models|services)': '<rootDir>/src/test/fileMock.js',
  },
  // to obtain access to the matchers.
  setupFilesAfterEnv: ['./src/test/setupTests.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // modulePaths: ['<rootDir>'],
  // transform: {
  //   // ".(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": '<rootDir>/src/test/fileMocks.js',
  //   '.(css|less|scss)$': '<rootDir>/src/test/styleMock.js'
  // },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.tsx', // Specify the files to include in coverage (all TypeScript files in src folder)
    '!src/**/*.d.tsx', // Exclude TypeScript definition files from coverage
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
  roots: ['src'],
  testMatch: ['<rootDir>/src/**/?(*.)test.{ts,tsx}'],
  //
  // transform: {
  //   "^.+\\.tsx?$": "ts-jest"
  // },
};
