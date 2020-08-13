import { InventarConfig, InventarMakerOutput, InventarOptions } from '../types'
import { config2CssVars, resolveConfig } from './core'
import { mergeOptionsWithDefaults } from './utils'

export const makeInventar = (config: InventarConfig, options: InventarOptions = {}): InventarMakerOutput => {
	const optionsWithDefaults = mergeOptionsWithDefaults(options)
	const jsInventar = resolveConfig(config)
	const cssInventarObject = optionsWithDefaults.shouldMakeCssInventar
		? config2CssVars(jsInventar, optionsWithDefaults)
		: {}

	return { jsInventar, ...cssInventarObject }
}
