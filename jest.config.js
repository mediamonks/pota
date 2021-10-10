
// TODO: make jest like esm

module.exports = {
  testMatch: ["**/*.test.ts"],
  verbose: true,
  rootDir: "test",
  modulePaths: ["<rootDir>/lib"],
  transformIgnorePatterns: ["/node_modules/"],
  extensionsToTreatAsEsm: [".ts"]
}
