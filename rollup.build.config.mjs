// rollup.config.js
import copy from "@guanghechen/rollup-plugin-copy";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "esm",
    sourcemap: true,
  },
  plugins: [
    typescript(),
    copy({
      targets: [
        { src: "public/**/*", dest: "dist" },
        { src: "node_modules/@babylonjs/**/*", dest: "dist/@babylonjs/" },
      ],
    }),
  ],
};
