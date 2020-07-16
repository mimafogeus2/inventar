import {
  InventarConfig,
  InventarDerivativeValue,
  InventarOptions,
  InventarProcessor,
  InventarProcessorConfig,
  InventarRawValueObject,
  InventarTestFunction,
  InventarValue,
  InventarValueTuple,
} from '../../types'

const camelCase2KebabCase = (str: string) => str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
const cssVars2StyleString = (config: InventarConfig) => (
  Object.entries(config).map(([name, value]) => `${name}: ${value}`).join(';')
)
const injectCssVars = (formattedConfig: InventarConfig, domEl: HTMLElement) => {
  const styleString = cssVars2StyleString(formattedConfig)
  domEl.setAttribute('style', styleString)
}

export const DEFAULT_OPTIONS: InventarOptions = {
  cssVarsInjector: injectCssVars,
  js2CssNameFormatter: camelCase2KebabCase,
  onUpdate: () => {},
}

export const mergeOptionsWithDefaults = (options: InventarOptions) => ({ ...DEFAULT_OPTIONS, ...options }) as InventarOptions
export const isDerivative = (val?: any): val is InventarDerivativeValue => val?.constructor === Function
export const isValueConfig = (val?: any): val is InventarRawValueObject => val?.value !== undefined
export const isFieldName = (val?: any): boolean => val?.constructor === String
export const isValue = (val?: any): val is InventarValue => val?. constructor === String || val?.constructor === Number
export const isValueTuple = (val?: any): val is InventarValueTuple => val?.constructor === Array
  && val.length === 2
  && isFieldName(val[0])
  && isValue(val[1])
export const isProcessor = (val?: any): val is InventarProcessor => val?.constructor === Function
export const isProcessorConfig = (val?: any): val is InventarProcessorConfig => isProcessor(val?.processor)
export const isTestFunction = (val?: any): val is InventarTestFunction => val?.constructor === Function
