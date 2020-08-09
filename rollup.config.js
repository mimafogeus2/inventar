import babel from '@rollup/plugin-babel'
import clear from "rollup-plugin-clear"
import commonjs from '@rollup/plugin-commonjs'
import dts from 'rollup-plugin-dts'
import filesize from 'rollup-plugin-filesize'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'

const OUTPUT_DIR = 'dist/'

export default () => [{
  input: ["./src/index.ts"],
  output: [
    {
      file: `${OUTPUT_DIR}/main/inventar.js`,
      format: "system",
      exports: 'named',
      sourcemap: true,
    },
    {
      file: `${OUTPUT_DIR}/main/inventar.min.js`,
      format: "system",
      exports: 'named',
      sourcemap: true,
      plugins: [terser()],
    },
    {
      file: `${OUTPUT_DIR}/module/inventar.esm.js`,
      format: "esm",
      sourcemap: true,
    },
  ],
  plugins: [
    clear({
      targets: [`${OUTPUT_DIR}esm`, `${OUTPUT_DIR}system`],
      watch: true,
    }),
    typescript({ tsconfig: 'tsconfig.prod.json' }),
    commonjs({ extensions: ['.js', '.ts'] }),
    babel({ "babelHelpers": "bundled" }),
    filesize({ showMinifiedSize: false }),
  ],
  external: ["tslib"],
}, {
  input: './src/types/index.ts',
  output: [{ file: `${OUTPUT_DIR}/main/inventar.d.ts` }, { file: `${OUTPUT_DIR}/module/inventar.d.ts` }],
  plugins: [dts()]
}]
