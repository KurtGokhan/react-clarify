/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.spec.json',
      },
    ],
  },
  collectCoverage: true,
  coverageProvider: 'v8',
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/types.ts',
    '!**/tests/**',
    '!**/node_modules/**',
    '!<rootDir>/out/**',
    '!<rootDir>/examples/**',
    '!<rootDir>/website/**',
    '!<rootDir>/.next/**',
    '!<rootDir>/*.config.js',
    '!<rootDir>/coverage/**',
    '!<rootDir>/dist/**',
    '!<rootDir>/artifacts/**',
    '!<rootDir>/out/**',
  ],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    '<rootDir>/artifacts/',
    '<rootDir>/dist/',
    '<rootDir>/out/',
    '<rootDir>/coverage/',
    '<rootDir>/examples/',
    '<rootDir>/website/',
    '<rootDir>/node_modules/',
  ],
  roots: ['<rootDir>'],
  modulePaths: ['.'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
};
