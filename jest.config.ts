import type { Config } from 'jest'
const config: Config = {
  // Coverage collection
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/app/layout.tsx',
    '!src/app/**/layout.tsx',
    '!src/middleware.ts',
    '!src/instrumentation*.ts',
    '!**/node_modules/**',
  ],

  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },

  // Preset
  preset: 'ts-jest',

  // Test environment setup
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // Module name mapping for path aliases
  moduleNameMapper: {
    // Handle module aliases (e.g., @/components/*)
    '^@/(.*)$': '<rootDir>/src/$1',

    // Mock specific modules.
    // '^lib/redis$': '<rootDir>/__mocks__/redis.ts', // This was incorrect
  },

  // Test match patterns
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/out/',
    '/coverage/',
  ],

  // Transform configuration
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
      },
    }],
  },

  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Verbose output
  verbose: true,
}

export default config
