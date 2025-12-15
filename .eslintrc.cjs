module.exports = {
  root: true,
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module"
  },
  env: {
    es2022: true,
    node: true
  },
  ignorePatterns: ["apps/web/.next", "apps/desktop/src-tauri/target", "dist", ".next", "coverage"],
  rules: {
    "no-console": "off"
  }
};
