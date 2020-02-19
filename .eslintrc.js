const prettierRc = require("./.prettierrc");
module.exports = {
  env: {
    node: true,
    jest: true,
  },
  extends: ["plugin:@typescript-eslint/recommended", "plugin:prettier/recommended", "prettier/@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    project: "./tsconfig.eslint.json",
    noWatch: true,
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/member-ordering": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-useless-constructor": "error",
    "@typescript-eslint/no-explicit-any": "off",
    "func-style": ["error", "declaration"],
    "lines-between-class-members": ["error", "always"],
    "no-useless-constructor": "off",
    "no-unused-vars": "off",
    "prettier/prettier": ["error", prettierRc],
  },
};
