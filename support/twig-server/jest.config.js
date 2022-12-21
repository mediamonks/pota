export default {
  // https://kulshekhar.github.io/ts-jest/docs/guides/esm-support
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    '^.+\\.m?[tj]sx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  // setupFilesAfterEnv: ['<rootDir>/test-utils/setupTests.ts'],

  // added "(?<!types.)" as a negative lookbehind to the default pattern
  // to exclude .types.test.ts patterns from being picked up by jest
  testRegex: '(/__tests__/.*|(\\.|/)(?<!types.)(test|spec))\\.[jt]sx?$',
};
