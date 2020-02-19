module.exports = {
  bail: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/node_modules/"],
  coverageReporters: ["text-summary", "json-summary", "lcov", "text", "clover"],
  moduleDirectories: ["<rootDir>", "<rootDir>/src", "node_modules"],
  preset: "ts-jest",
  rootDir: "./test",
  testEnvironment: "node",
  verbose: true,
};
