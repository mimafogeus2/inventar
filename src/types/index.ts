export type InventarValue = string | number
export type InventarDerivativeValue<T = InventarValue> = (config: Inventar) => T
export type InventarConfigValueField = InventarValue | InventarDerivativeValue
export interface InventarRawValueObjectWithValue {
	value: InventarConfigValueField
	transformers?: InventarTransformersSequence
}
export interface InventarRawValueTransformersOnlyObject {
	transformers: InventarNonEmptyTransformersSequence
}
export type InventarRawValueObject = InventarRawValueObjectWithValue | InventarRawValueTransformersOnlyObject
export type InventarConfigValue = InventarConfigValueField | InventarRawValueObject

export type InventarEntryTuple = [string, InventarValue]
export type InventarDerivativeName = InventarDerivativeValue<string>
export type InventarTransformedName = string | InventarDerivativeName

// A transformer modifies a config name and value pair to one or more new config and value pairs.
export type InventarTransformer = (tuple: InventarEntryTuple) => InventarEntryTuple[]
export type InventarTransformerHoc = (...args: any[]) => InventarTransformer
export interface InventarTransformerObject {
	transformer: InventarTransformer
	test?: InventarTester
}
export type InventarTransformersSequence = Array<InventarTransformer | InventarTransformerObject>
export type InventarNonEmptyTransformersSequence = {
	0: InventarTransformer | InventarTransformerObject // An array with at least one item.
} & InventarTransformersSequence

// Tests allow to define what fields a global transformer runs on
export type InventarTesterFunction = (tuple: InventarEntryTuple) => boolean
export type InventarTester = InventarTesterFunction | RegExp

// An injector function injects formatted config data to a DOM element (e.g. CSS variables).
export type InventarInjector = (formattedConfig: Inventar, domEl?: HTMLElement) => void
export type InventarBoundInjector = (domEl?: HTMLElement) => void

export type InventarConfig = Record<string, InventarConfigValue>
export type Inventar = Record<string, InventarValue>

export type InventarExcludeObject = symbol | Record<string, unknown>
export type InventarOutputFunction<T> = (config: Inventar, options?: InventarOptions) => T | InventarExcludeObject

export interface InventarOutputObject {
	outputFunction: InventarOutputFunction<any>
	transformers?: InventarTransformersSequence
}

export interface InventarOptions {
	js2CssNameFormatter?: (jsName: string) => string
	cssVarsInjector?: InventarInjector
	outputs?: Record<string, InventarOutputFunction<any> | InventarOutputObject>
	preTransformers?: InventarTransformersSequence
	postTransformers?: InventarTransformersSequence
	shouldMakeCssInventar?: boolean
}

export type InventarMakerOutput = Record<string, any>
