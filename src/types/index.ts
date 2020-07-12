export type ChryssoValue = string | number
export type ChryssoRawValueField = ChryssoValue | ChryssoDerivativeValue
export type ChryssoDerivativeValue<T = ChryssoValue> = (config: ChryssoConfig) => T
export type ChryssoDerivativeName = ChryssoDerivativeValue<string>
export type ChryssoRawConfigValue = ChryssoRawValueField | ChryssoRawValueObject
export type ChryssoRawValueObject = { value: ChryssoRawValueField, processors?: ChryssoProcessor[] }
export type ChryssoProcessedString = string | ChryssoDerivativeName
export type ChryssoValueTuple = [string, ChryssoValue]

// A processor modifies a config name and value pair to one or more new config and value pairs.
export type ChryssoProcessor = (tuple: ChryssoValueTuple) => ChryssoValueTuple[]

// An injector function injects formatted config data to a DOM element (e.g. CSS variables).
export type ChryssoInjector = (formattedConfig: ChryssoConfig, domEl: HTMLElement) => void
export type ChryssoBoundInjector = (domEl: HTMLElement) => void

export type ChryssoRawConfig = Record<string, ChryssoRawConfigValue>
export type ChryssoConfig = Record<string, ChryssoValue>

export type ChryssoOptions = {
  js2CssNameFormatter?: (jsName: string) => string,
  cssVarsInjector?: ChryssoInjector,
  onUpdate?: (config: ChryssoConfig, cssVars: ChryssoConfig, inject: ChryssoBoundInjector) => void,
  preProcessors?: ChryssoProcessor[],
  postProcessors?: ChryssoProcessor[],
}
