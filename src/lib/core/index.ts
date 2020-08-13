import { Inventar, InventarBoundInjector, InventarConfig, InventarOptions } from '../../types'
import { mergeOptionsWithDefaults } from '../utils'
import { resolveDependencies } from './resolveDependencies'

export const resolveConfig = (rawConfig: InventarConfig) => {
	const resolvedConfig = resolveDependencies(rawConfig)

	return Object.freeze(resolvedConfig)
}

export const config2CssVars = (config: Inventar, options: InventarOptions = {}) => {
	const { js2CssNameFormatter, cssVarsInjector } = mergeOptionsWithDefaults(options)

	const resolvedCssVars = Object.entries(config).reduce((agg, [name, value]) => {
		const cssVarName = `--${js2CssNameFormatter(name)}`
		agg[cssVarName] = value
		return agg
	}, {} as Inventar)

	const inject: InventarBoundInjector = cssVarsInjector.bind(null, resolvedCssVars)

	return {
		cssInventar: Object.freeze(resolvedCssVars),
		inject,
	}
}
