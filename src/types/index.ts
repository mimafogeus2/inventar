export type InventarValue = string | number
export type InventarRawValueField = InventarValue | InventarDerivativeValue
export type InventarDerivativeValue<T = InventarValue> = (config: InventarConfig) => T
export type InventarDerivativeName = InventarDerivativeValue<string>
export type InventarRawConfigValue = InventarRawValueField | InventarRawValueObject
export interface InventarRawValueObject { value: InventarRawValueField, processors?: InventarProcessors }
export type InventarProcessedString = string | InventarDerivativeName
export type InventarValueTuple = [string, InventarValue]

// A processor modifies a config name and value pair to one or more new config and value pairs.
export type InventarProcessor = (tuple: InventarValueTuple) => InventarValueTuple[]
export interface InventarProcessorConfig { processor: InventarProcessor, test?: InventarTest }
export type InventarProcessors = Array<InventarProcessor | InventarProcessorConfig>

// Tests allow to define what fields a global processor runs on
export type InventarTestFunction = (tuple: InventarValueTuple) => boolean
export type InventarTest = InventarTestFunction | RegExp

// An injector function injects formatted config data to a DOM element (e.g. CSS variables).
export type InventarInjector = (formattedConfig: InventarConfig, domEl: HTMLElement) => void
export type InventarBoundInjector = (domEl: HTMLElement) => void

export type InventarRawConfig = Record<string, InventarRawConfigValue>
export type InventarConfig = Record<string, InventarValue>

export interface InventarOptions {
  js2CssNameFormatter?: (jsName: string) => string,
  cssVarsInjector?: InventarInjector,
  onUpdate?: (config: InventarConfig, cssVars: InventarConfig, inject: InventarBoundInjector) => void,
  preProcessors?: InventarProcessors,
  postProcessors?: InventarProcessors,
}
