import { ChryssoConfig, ChryssoOptions, ChryssoRawConfig, ChryssoBoundInjector } from '../../types'
import { mergeOptionsWithDefaults } from '../utils'
import { resolveDependencies } from './resolveDependencies'

export const resolveConfig = (rawConfig: ChryssoRawConfig) => {
  const resolvedConfig = resolveDependencies(rawConfig)

  return Object.freeze(resolvedConfig)
}

export const config2CssVars = (config: ChryssoConfig, options: ChryssoOptions = {}) => {
  const { js2CssNameFormatter, cssVarsInjector } = mergeOptionsWithDefaults(options)

  const resolvedCssVars = Object.entries(config).reduce(
    (agg, [name, value]) => {
      const cssVarName = `--${js2CssNameFormatter(name)}`
      agg[cssVarName] = value
      return agg
    },
    {} as ChryssoConfig
  )

  const inject = cssVarsInjector.bind(null, resolvedCssVars) as ChryssoBoundInjector

  return {
    cssVars: Object.freeze(resolvedCssVars),
    inject,
  }
}
