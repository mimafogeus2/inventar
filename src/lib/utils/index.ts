import { ChryssoConfig, ChryssoOptions, ChryssoDerivativeValue, ChryssoRawValueObject } from '../../types'
import { resolveDependencies } from './resolveDependencies'
import { processConfig } from './processConfig'

const camelCase2KebabCase = (str: string) => str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
const cssVars2StyleString = (config: ChryssoConfig) => (
  Object.entries(config).map(([name, value]) => `${name}: ${value}`).join(';')
)
const injectCssVars = (formattedConfig: ChryssoConfig, domEl: HTMLElement) => {
  const styleString = cssVars2StyleString(formattedConfig)
  domEl.setAttribute('style', styleString)
}

export const DEFAULT_OPTIONS: ChryssoOptions = {
  cssVarsInjector: injectCssVars,
  js2CssNameFormatter: camelCase2KebabCase,
  onUpdate: () => {},
}

export const mergeOptionsWithDefaults = (options: ChryssoOptions) => ({ ...DEFAULT_OPTIONS, ...options }) as ChryssoOptions
export const isDerivative = (val?: any): val is ChryssoDerivativeValue => val?.constructor === Function
export const isValueConfig = (val?: any): val is ChryssoRawValueObject  => val?.value !== undefined

export { resolveDependencies, processConfig }
