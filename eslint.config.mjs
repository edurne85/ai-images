import eslintReact from "@eslint-react/eslint-plugin";
import eslintJs from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tseslint from "typescript-eslint";
import globals from "globals";

export default [
  {
    ignores: [
      "dist/**",
      "dist-electron/**",
      "node_modules/**",
      "vite.config.*",
    ],
  },
  eslintJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintReact.configs.recommended,
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],

    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    rules: {
      ...tsPlugin.configs.recommended.rules,
    },
  },
];
