import test from 'ava'

import { resolveConfig, processOutputs } from '.'
import { mergeOptionsWithDefaults, EXCLUDE_OUTPUT_SYMBOL } from '../utils'

const SIMPLE_CONFIG = { color: '#f00', anotherColor: () => '#0f0' }
const MINIMAL_RESOLVED_CONFIG = Object.freeze({ color: '#f00' })
const CUSTOM_OUTPUT_FUNCTION = inventar =>
	Object.entries(inventar).reduce((agg, [name, value]) => {
		agg[`${name}${name}`] = value
		return agg
	}, {})
const EXCLUDE_OUTPUT_FUNCTION = () => EXCLUDE_OUTPUT_SYMBOL

test('resolveConfig', t => {
	const resolvedConfig = resolveConfig(SIMPLE_CONFIG)
	t.deepEqual(resolvedConfig, { color: '#f00', anotherColor: '#0f0' })
	t.is(Object.isFrozen(resolvedConfig), true)
})

test('processOutputs, default options', t => {
	const defaultOutputs = processOutputs(MINIMAL_RESOLVED_CONFIG, mergeOptionsWithDefaults({}))
	t.deepEqual(Object.keys(defaultOutputs), ['jsInventar', 'cssInventar', 'inject'])
	t.deepEqual(defaultOutputs.jsInventar, { color: '#f00' })
	t.deepEqual(defaultOutputs.cssInventar, { '--color': '#f00' })
})

test('processOutputs, shouldMakeCssInventar === false', t => {
	const defaultOutputs = processOutputs(
		MINIMAL_RESOLVED_CONFIG,
		mergeOptionsWithDefaults({ shouldMakeCssInventar: false })
	)
	t.deepEqual(Object.keys(defaultOutputs), ['jsInventar'])
	t.deepEqual(defaultOutputs.jsInventar, { color: '#f00' })
})

test('processOutputs, custom output', t => {
	const output = processOutputs(
		MINIMAL_RESOLVED_CONFIG,
		mergeOptionsWithDefaults({ outputs: { myOutput: CUSTOM_OUTPUT_FUNCTION } })
	)
	t.deepEqual(output, { myOutput: { colorcolor: '#f00' } })
})

test('processOutputs, custom output with EXCLUDE_OUTPUT_SYMBOL', t => {
	const output = processOutputs(
		MINIMAL_RESOLVED_CONFIG,
		mergeOptionsWithDefaults({ outputs: { myOutput: CUSTOM_OUTPUT_FUNCTION, excludedOutput: EXCLUDE_OUTPUT_FUNCTION } })
	)
	t.deepEqual(output, { myOutput: { colorcolor: '#f00' } })
})
