declare type InventarValue = string | number;
declare type InventarDerivativeValue<T = InventarValue> = (config: Inventar) => T;
declare type InventarConfigValueField = InventarValue | InventarDerivativeValue;
interface InventarRawValueObjectWithValue {
    value: InventarConfigValueField;
    transformers?: InventarTransformersSequence;
}
interface InventarRawValueTransformersOnlyObject {
    transformers: InventarNonEmptyTransformersSequence;
}
declare type InventarRawValueObject = InventarRawValueObjectWithValue | InventarRawValueTransformersOnlyObject;
declare type InventarConfigValue = InventarConfigValueField | InventarRawValueObject;
declare type InventarEntryTuple = [string, InventarValue];
declare type InventarTransformer = (tuple: InventarEntryTuple) => InventarEntryTuple[];
declare type InventarTransformerHoc = (...args: any[]) => InventarTransformer;
interface InventarTransformerObject {
    transformer: InventarTransformer;
    test?: InventarTester;
}
declare type InventarTransformersSequence = Array<InventarTransformer | InventarTransformerObject>;
declare type InventarNonEmptyTransformersSequence = {
    0: InventarTransformer | InventarTransformerObject;
} & InventarTransformersSequence;
declare type InventarTesterFunction = (tuple: InventarEntryTuple) => boolean;
declare type InventarTester = InventarTesterFunction | RegExp;
declare type InventarInjector = (formattedConfig: Inventar, domEl?: HTMLElement) => void;
declare type InventarBoundInjector = (domEl?: HTMLElement) => void;
declare type InventarConfig = Record<string, InventarConfigValue>;
declare type Inventar = Record<string, InventarValue>;
declare type InventarExcludeObject = symbol | Record<string, unknown>;
declare type InventarOutputFunction<T> = (config: Inventar, options?: InventarOptions) => T | InventarExcludeObject;
interface InventarOutputObject {
    outputFunction: InventarOutputFunction<any>;
    transformers?: InventarTransformersSequence;
}
interface InventarOptions {
    js2CssNameFormatter?: (jsName: string) => string;
    cssVarsInjector?: InventarInjector;
    outputs?: Record<string, InventarOutputFunction<any> | InventarOutputObject>;
    preTransformers?: InventarTransformersSequence;
    postTransformers?: InventarTransformersSequence;
    shouldMakeCssInventar?: boolean;
}
declare type InventarMakerOutput = Record<string, any>;

declare const makeInventar: (config: InventarConfig, options?: InventarOptions) => InventarMakerOutput;

declare const camelCase2KebabCase: (str: string) => string;
declare const injectToStyle: (formattedConfig: Inventar, domEl: HTMLElement) => void;
declare const injectToRoot: (formattedConfig: Inventar) => void;
declare const defaultToJsInventarOutput: InventarOutputFunction<Inventar>;
declare const defaultToCssInventarOutput: InventarOutputFunction<Inventar>;
declare const defaultToInjectOutput: InventarOutputFunction<InventarBoundInjector>;
declare const isDerivative: (val?: any) => val is InventarDerivativeValue<InventarValue>;
declare const isValueObject: (val?: any) => val is InventarRawValueObject;
declare const isEntryTuple: (val?: any) => val is InventarEntryTuple;

export default makeInventar;
export { Inventar, InventarBoundInjector, InventarConfig, InventarInjector, InventarMakerOutput, InventarOptions, InventarTester, InventarTesterFunction, InventarTransformer, InventarTransformerHoc, InventarTransformerObject, InventarTransformersSequence, camelCase2KebabCase, defaultToCssInventarOutput, defaultToInjectOutput, defaultToJsInventarOutput, injectToRoot, injectToStyle, isDerivative, isEntryTuple, isValueObject, makeInventar };
