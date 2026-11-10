import nextVitals from "eslint-config-next/core-web-vitals";
import tseslint from "typescript-eslint";

const typescriptFiles = ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"];
const scopedTypeScriptConfig = (configs) =>
  configs.map((config) => ({
    ...config,
    files: config.files ?? typescriptFiles,
  }));

export default [
  {
    ignores: ["eslint.config.mjs"],
  },
  ...nextVitals,
  ...scopedTypeScriptConfig(tseslint.configs.recommendedTypeChecked),
  ...scopedTypeScriptConfig(tseslint.configs.stylisticTypeChecked),
  {
    files: typescriptFiles,
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
    rules: {
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],
    },
  },
];
