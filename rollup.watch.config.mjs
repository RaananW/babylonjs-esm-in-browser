// rollup.config.js
import copy from "@guanghechen/rollup-plugin-copy";
import typescript from "@rollup/plugin-typescript";
import serve from "rollup-plugin-serve";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "esm",
    sourcemap: true,
  },
  plugins: [
    typescript(),
    serve("dist"),
    copy({
      targets: [
        { src: "public/**/*", dest: "dist" },
        // { src: "node_modules/@babylonjs/**/*", dest: "dist/@babylonjs/" },
      ],
    }),
  ],
};
