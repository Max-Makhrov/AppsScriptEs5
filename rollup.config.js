import typescript from "rollup-plugin-typescript2";
import alias from "@rollup/plugin-alias";

export default {
  input: "./src/main.ts", // your main TypeScript file
  output: {
    file: "./dist/Code.js",
    format: "es",
  },
  plugins: [
    typescript(),
    alias({
      entries: [{ find: "src", replacement: "./src" }],
    }),
  ],
};
