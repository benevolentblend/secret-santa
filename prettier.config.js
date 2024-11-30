/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: [
    "prettier-plugin-tailwindcss",
    "@ianvs/prettier-plugin-sort-imports",
  ],
  importOrder: [
    "^react$",
    "^next",
    "",
    "<THIRD_PARTY_MODULES>",
    "",
    "~/server/(.*)$",
    "^~/components/(.*)$",
    "^~/utils/(.*)$",

    "",
    "^~/lib/(.*)$",
    "",
    "^[./]", // local files
    "^~public/*", // root/public
  ],
};

export default config;
