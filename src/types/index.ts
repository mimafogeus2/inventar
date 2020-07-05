export type ChryssoValue = string | number
export type ChryssoProcessedValue = ChryssoValue | ChryssoDerivativeValue
export type ChryssoDerivativeValue<T = ChryssoValue> = (config: ChryssoConfig) => T
export type ChryssoRawConfigValue = ChryssoProcessedValue | ChryssoRawValueObject
export type ChryssoRawValueObject = { value: ChryssoProcessedValue }

export type ChryssoInjector = (formattedConfig: ChryssoConfig, domEl: HTMLElement) => void
export type ChryssoBoundInjector = (domEl: HTMLElement) => void

export type ChryssoRawConfig = Record<string, ChryssoRawConfigValue>
export type ChryssoProcessedConfig = Record<string, ChryssoProcessedValue>
export type ChryssoProcessedConfigTuples = Array<[string | ChryssoDerivativeValue<string>, ChryssoProcessedValue]>
export type ChryssoConfig = Record<string, ChryssoValue>

export type ChryssoOptions = {
  js2CssNameFormatter?: (jsName: string) => string,
  cssVarsInjector?: ChryssoInjector,
  onUpdate?: (config: ChryssoConfig, cssVars: ChryssoConfig, inject: ChryssoBoundInjector) => void,
}
