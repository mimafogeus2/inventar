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
interface InventarOptions {
    js2CssNameFormatter?: (jsName: string) => string;
    cssVarsInjector?: InventarInjector;
    preTransformers?: InventarTransformersSequence;
    postTransformers?: InventarTransformersSequence;
    shouldMakeCssInventar?: boolean;
}
interface InventarMakerOutput {
    cssInventar?: Inventar;
    inject?: InventarBoundInjector;
    jsInventar: Inventar;
}

declare const makeInventar: (config: InventarConfig, options?: InventarOptions) => InventarMakerOutput;

declare const camelCase2KebabCase: (str: string) => string;
declare const injectToStyle: (formattedConfig: Inventar, domEl: HTMLElement) => void;
declare const injectToRoot: (formattedConfig: Inventar) => void;
declare const isDerivative: (val?: any) => val is InventarDerivativeValue<InventarValue>;
declare const isValueObject: (val?: any) => val is InventarRawValueObject;
declare const isEntryTuple: (val?: any) => val is InventarEntryTuple;

export default makeInventar;
export { Inventar, InventarBoundInjector, InventarConfig, InventarInjector, InventarMakerOutput, InventarOptions, InventarTester, InventarTesterFunction, InventarTransformer, InventarTransformerHoc, InventarTransformerObject, InventarTransformersSequence, camelCase2KebabCase, injectToRoot, injectToStyle, isDerivative, isEntryTuple, isValueObject, makeInventar };
