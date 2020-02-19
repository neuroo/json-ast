module.exports = {
  "*.{js,ts}": ["eslint --fix", "git add"],
  "*.{json,yml,yaml,md,graphql}": ["prettier --write", "git add"],
};
