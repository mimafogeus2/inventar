import { InventarConfig, InventarMakerOutput, InventarOptions } from '../types'
import { processOutputs, resolveConfig } from './core'
import { mergeOptionsWithDefaults } from './utils'

export const makeInventar = (config: InventarConfig, options: InventarOptions = {}): InventarMakerOutput => {
	const optionsWithDefaults = mergeOptionsWithDefaults(options)
	const inventar = resolveConfig(config)
	const outputs = processOutputs(inventar, optionsWithDefaults)

	return outputs
}
