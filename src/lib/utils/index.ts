import {
  ChryssoConfig,
  ChryssoDerivativeValue,
  ChryssoOptions,
  ChryssoRawValueObject,
  ChryssoValue,
  ChryssoValueTuple,
} from '../../types'

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
export const isValueConfig = (val?: any): val is ChryssoRawValueObject => val?.value !== undefined
export const isFieldName = (val?: any): boolean => val?.constructor === String
export const isValue = (val?: any): val is ChryssoValue => val?. constructor === String || val?.constructor === Number
export const isValueTuple = (val?: any): val is ChryssoValueTuple => val?.constructor === Array
  && val.length === 2
  && isFieldName(val[0])
  && isValue(val[1])
