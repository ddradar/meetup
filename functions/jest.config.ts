import { Config } from '@jest/types'

const config: Config.InitialOptions = {
  displayName: 'Functions',
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverage: false,
  collectCoverageFrom: [
    '**/*.ts',
    '!**/index.ts',
    '!**/*.d.ts',
    '!<rootDir>/*.config.ts',
    '!**/__tests__/**',
  ],
}
export default config
