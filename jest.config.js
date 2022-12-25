// jest.config.js
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jest-environment-jsdom",

  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured for you soon)
    "^@/components/(.*)$": "<rootDir>/src/components/$1",
    "^@/pages/(.*)$": "<rootDir>/src/pages/$1",
    "^@/hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^@/providers/(.*)$": "<rootDir>/src/providers/$1",
    "^@/utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@/server/(.*)$": "<rootDir>/src/server/$1",
    "^@/helpers/(.*)$": "<rootDir>/src/helpers/$1",
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
const asyncConfig = createJestConfig(customJestConfig);

// workaround for not being able to override transformIgnorePatterns in Nextjs
// https://github.com/vercel/next.js/discussions/31152#discussioncomment-1697047
const esModules = ["wagmi", "@wagmi"].join("|");

module.exports = async () => {
  const config = await asyncConfig();
  config.transformIgnorePatterns = [`/node_modules/(?!${esModules})`];
  return config;
};
