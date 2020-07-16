import { InventarBoundInjector, InventarConfig, InventarOptions, InventarRawConfig } from '../../types'
import { mergeOptionsWithDefaults } from '../utils'
import { resolveDependencies } from './resolveDependencies'

export const resolveConfig = (rawConfig: InventarRawConfig) => {
  const resolvedConfig = resolveDependencies(rawConfig)

  return Object.freeze(resolvedConfig)
}

export const config2CssVars = (config: InventarConfig, options: InventarOptions = {}) => {
  const { js2CssNameFormatter, cssVarsInjector } = mergeOptionsWithDefaults(options)

  const resolvedCssVars = Object.entries(config).reduce(
    (agg, [name, value]) => {
      const cssVarName = `--${js2CssNameFormatter(name)}`
      agg[cssVarName] = value
      return agg
    },
    {} as InventarConfig
  )

  const inject: InventarBoundInjector = cssVarsInjector.bind(null, resolvedCssVars)

  return {
    cssVars: Object.freeze(resolvedCssVars),
    inject,
  }
}
