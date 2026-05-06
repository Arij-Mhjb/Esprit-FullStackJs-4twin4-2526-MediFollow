import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["lcov", "text", "html"],
  collectCoverageFrom: [
    // Only collect coverage for files directly tested by the test suite
    "lib/actions/admin.actions.ts",
    "!**/node_modules/**",
    "!**/.next/**",
  ],
  testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react",
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
      },
    ],
  },
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  modulePathIgnorePatterns: ["/.next/"],
  verbose: true,
  clearMocks: true,
  restoreMocks: true,
  testTimeout: 10000,
};

export default config;
