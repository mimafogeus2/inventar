declare type InventarValue = string | number;
declare type InventarDerivativeValue<T = InventarValue> = (config: Inventar) => T;
declare type InventarConfigValueField = InventarValue | InventarDerivativeValue;
interface InventarRawValueObject {
    value: InventarConfigValueField;
    transformers?: InventarTransformersSequence;
}
declare type InventarConfigValue = InventarConfigValueField | InventarRawValueObject;
declare type InventarEntryTuple = [string, InventarValue];
declare type InventarDerivativeName = InventarDerivativeValue<string>;
declare type InventarTransformedName = string | InventarDerivativeName;
declare type InventarTransformer = (tuple: InventarEntryTuple) => InventarEntryTuple[];
interface InventarTransformerObject {
    transformer: InventarTransformer;
    test?: InventarTester;
}
declare type InventarTransformersSequence = Array<InventarTransformer | InventarTransformerObject>;
declare type InventarTesterFunction = (tuple: InventarEntryTuple) => boolean;
declare type InventarTester = InventarTesterFunction | RegExp;
declare type InventarInjector = (formattedConfig: Inventar, domEl: HTMLElement) => void;
declare type InventarBoundInjector = (domEl: HTMLElement) => void;
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

export { Inventar, InventarBoundInjector, InventarConfig, InventarConfigValue, InventarConfigValueField, InventarDerivativeName, InventarDerivativeValue, InventarEntryTuple, InventarInjector, InventarMakerOutput, InventarOptions, InventarRawValueObject, InventarTester, InventarTesterFunction, InventarTransformedName, InventarTransformer, InventarTransformerObject, InventarTransformersSequence, InventarValue };
