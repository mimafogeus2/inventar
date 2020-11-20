import { Inventar, InventarConfig, InventarOptions } from '../../types'
import { resolveDependencies } from './resolveDependencies'
import { isOutputFunction, EXCLUDE_OUTPUT_SYMBOL } from '../utils'

export const resolveConfig = (rawConfig: InventarConfig, options?: InventarOptions) => {
	const resolvedConfig = resolveDependencies(rawConfig, options)

	return Object.freeze(resolvedConfig)
}

export const processOutputs = (config: Inventar, options: InventarOptions) =>
	Object.entries(options.outputs).reduce((agg, [outputName, outputConfig]) => {
		const outputFunction = isOutputFunction(outputConfig) ? outputConfig : outputConfig.outputFunction
		const outputTransformers = isOutputFunction(outputConfig) ? [] : outputConfig?.transformers
		const transformOutputOptions = { ...options, preTransformers: [], postTransformers: outputTransformers }
		const transformedConfig =
			outputTransformers && outputTransformers.length ? resolveConfig(config, transformOutputOptions) : config

		const processedOutput = outputFunction(transformedConfig, options)
		if (processedOutput !== EXCLUDE_OUTPUT_SYMBOL) {
			agg[outputName] = processedOutput
		}
		return agg
	}, {} as Record<string, any>)
