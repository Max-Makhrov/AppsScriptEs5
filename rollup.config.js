import typescript from "rollup-plugin-typescript2";
import alias from "@rollup/plugin-alias";
import path from "path";

const projectRootDir = path.resolve(__dirname);
export default {
  input: "./src/main.ts", // your main TypeScript file
  output: {
    file: "./dist/Code.js",
    format: "es",
  },
  plugins: [
    typescript({ check: false }),
    alias({
      entries: [
        {
          find: "@",
          replacement: path.resolve(projectRootDir, "src"),
        },
      ],
    }),
  ],
};
