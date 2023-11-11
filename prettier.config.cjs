//! Temporary solution for resolving conflict between @trivago/prettier-plugin-sort-imports and prettier-plugin-tailwindcss

/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-var-requires */
const pluginSortImports = require("@trivago/prettier-plugin-sort-imports");
// @ts-ignore
const pluginTailwindcss = require("prettier-plugin-tailwindcss");

/**
 * @refs  https://github.com/tailwindlabs/prettier-plugin-tailwindcss/issues/31#issuecomment-1195411734
 */
/** @type {import("prettier").Parser}  */
const bothParser = {
  // @ts-ignore
  ...pluginSortImports.parsers.typescript,
  parse: pluginTailwindcss.parsers.typescript.parse,
};

/** @type {import("prettier").Plugin}  */
const mixedPlugin = {
  parsers: {
    typescript: bothParser,
  },
};

module.exports = {
  plugins: [mixedPlugin],
  importOrder: [
    "(^react$|^react/(.*)$)",
    "(^next$|^next/(.*)$)",
    "<THIRD_PARTY_MODULES>",
    "^~/(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
