export type InventarValue = string | number
export type InventarDerivativeValue<T = InventarValue> = (config: Inventar) => T
export type InventarConfigValueField = InventarValue | InventarDerivativeValue
export interface InventarRawValueObject { value: InventarConfigValueField, transformers?: InventarTransformersSequence }
export type InventarConfigValue = InventarConfigValueField | InventarRawValueObject

export type InventarEntryTuple = [string, InventarValue]
export type InventarDerivativeName = InventarDerivativeValue<string>
export type InventarTransformedName = string | InventarDerivativeName

// A transformer modifies a config name and value pair to one or more new config and value pairs.
export type InventarTransformer = (tuple: InventarEntryTuple) => InventarEntryTuple[]
export interface InventarTransformerObject { transformer: InventarTransformer, test?: InventarTester }
export type InventarTransformersSequence = Array<InventarTransformer | InventarTransformerObject>

// Tests allow to define what fields a global transformer runs on
export type InventarTesterFunction = (tuple: InventarEntryTuple) => boolean
export type InventarTester = InventarTesterFunction | RegExp

// An injector function injects formatted config data to a DOM element (e.g. CSS variables).
export type InventarInjector = (formattedConfig: Inventar, domEl: HTMLElement) => void
export type InventarBoundInjector = (domEl: HTMLElement) => void

export type InventarConfig = Record<string, InventarConfigValue>
export type Inventar = Record<string, InventarValue>

export interface InventarOptions {
  js2CssNameFormatter?: (jsName: string) => string,
  cssVarsInjector?: InventarInjector,
  onUpdate?: (config: Inventar, cssVars: Inventar, inject: InventarBoundInjector) => void,
  preTransformers?: InventarTransformersSequence,
  postTransformers?: InventarTransformersSequence,
}
