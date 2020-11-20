import { Inventar, InventarConfig, InventarOptions } from '../../types'
import { resolveDependencies } from './resolveDependencies'
import { isOutputFunction, EXCLUDE_OUTPUT_SYMBOL } from '../utils'

export const resolveConfig = (rawConfig: InventarConfig) => {
	const resolvedConfig = resolveDependencies(rawConfig)

	return Object.freeze(resolvedConfig)
}

export const processOutputs = (config: Inventar, options: InventarOptions) =>
	Object.entries(options.outputs).reduce((agg, [outputName, outputConfig]) => {
		const outputFunction = isOutputFunction(outputConfig) ? outputConfig : outputConfig.outputFunction
		const processedOutput = outputFunction(config, options)
		if (processedOutput !== EXCLUDE_OUTPUT_SYMBOL) {
			agg[outputName] = processedOutput
		}
		return agg
	}, {} as Record<string, any>)
