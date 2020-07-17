import {
  Inventar,
  InventarDerivativeValue,
  InventarEntryTuple,
  InventarOptions,
  InventarRawValueObject,
  InventarTesterFunction,
  InventarTransformer,
  InventarTransformerObject,
  InventarValue,
} from '../../types'

const camelCase2KebabCase = (str: string) => str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
const cssVars2StyleString = (config: Inventar) => (
  Object.entries(config).map(([name, value]) => `${name}: ${value}`).join(';')
)
export const injectCssVars = (formattedConfig: Inventar, domEl: HTMLElement) => {
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
export const isValueObject = (val?: any): val is InventarRawValueObject => val?.value !== undefined
export const isFieldName = (val?: any): boolean => val?.constructor === String
export const isValue = (val?: any): val is InventarValue => val?. constructor === String || val?.constructor === Number
export const isEntryTuple = (val?: any): val is InventarEntryTuple => val?.constructor === Array
  && val.length === 2
  && isFieldName(val[0])
  && isValue(val[1])
export const isTransformer = (val?: any): val is InventarTransformer => val?.constructor === Function
export const isTransformerObject = (val?: any): val is InventarTransformerObject => isTransformer(val?.transformer)
export const isTesterFunction = (val?: any): val is InventarTesterFunction => val?.constructor === Function
