/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  testEnvironment: 'jest-environment-node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
};
