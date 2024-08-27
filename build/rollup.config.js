const tsPlugin = require("@rollup/plugin-typescript");
const terser = require("@rollup/plugin-terser");
const { dts } = require("rollup-plugin-dts");

module.exports = [
  {
    input: "src/index.ts",
    plugins: [tsPlugin()],
    output: [
      {
        file: "dist/bundle.esm.js",
        format: "esm",
      },
      {
        file: "dist/bundle.common.js",
        format: "cjs",
      },
      {
        file: "dist/bundle.js",
        name: "Vuelite",
        format: "umd",
      },
    ],
  },
  {
    input: "src/index.ts",
    plugins: [tsPlugin(), terser()],
    output: [
      {
        file: "dist/bundle.min.js",
        name: "Vuelite",
        format: "esm",
      },
    ],
  },
  {
    input: "./dist/types/index.d.ts",
    plugins: [dts()],
    output: [{ file: "dist/index.d.ts", format: "esm" }],
  },
  {
    input: "./dist/types/index.d.ts",
    plugins: [dts()],
    output: [{ file: "dist/index.d.cts", format: "cjs" }],
  },
];
