import babel from '@rollup/plugin-babel'
import clear from 'rollup-plugin-clear'
import commonjs from '@rollup/plugin-commonjs'
import dts from 'rollup-plugin-dts'
import filesize from 'rollup-plugin-filesize'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'

const OUTPUT_DIR = 'dist/'

export default () => [
	{
		input: ['./src/index.ts'],
		output: [
			{
				file: `${OUTPUT_DIR}/main/inventar.js`,
				format: 'cjs',
				exports: 'named',
				sourcemap: true,
			},
			{
				file: `${OUTPUT_DIR}/main/inventar.min.js`,
				format: 'cjs',
				exports: 'named',
				sourcemap: true,
				plugins: [terser()],
			},
			{
				file: `${OUTPUT_DIR}/module/inventar.esm.js`,
				format: 'esm',
				sourcemap: true,
			},
			{
				file: `${OUTPUT_DIR}/external/inventar.min.js`,
				format: 'iife',
				exports: 'named',
				name: 'inventar',
				sourcemap: true,
				plugins: [terser()],
			},
		],
		plugins: [
			clear({
				targets: [`${OUTPUT_DIR}main`, `${OUTPUT_DIR}module`, `${OUTPUT_DIR}external`],
				watch: true,
			}),
			typescript({ tsconfig: 'tsconfig.prod.json' }),
			commonjs({ extensions: ['.js', '.ts'] }),
			babel({ babelHelpers: 'bundled' }),
			filesize({ showMinifiedSize: false }),
		],
	},
	{
		input: ['./src/index.ts'],
		output: [{ file: `${OUTPUT_DIR}/main/inventar.d.ts` }, { file: `${OUTPUT_DIR}/module/inventar.d.ts` }],
		plugins: [dts()],
	},
]
