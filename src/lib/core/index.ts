import { ChryssoRawConfig, ChryssoOptions, ChryssoConfig, ChryssoBoundInjector } from '../../types'
import { mergeOptionsWithDefaults } from '../utils'
import { processConfig } from './processConfig'
import { resolveDependencies } from './resolveDependencies'

export const resolveConfig = (rawConfig: ChryssoRawConfig) => {
  const processedConfig = processConfig(rawConfig)
  const resolvedConfig = resolveDependencies(processedConfig)

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
