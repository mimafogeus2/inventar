export type ChryssoValue = string | number
export type ChryssoDerivativeValue = (config: ChryssoRawConfig) => ChryssoValue
export type ChryssoRawConfigValue = ChryssoValue | ChryssoDerivativeValue

export type ChryssoInjector = (formattedConfig: ChryssoConfig, domEl: HTMLElement) => void
export type ChryssoBoundInjector = (domEl: HTMLElement) => void

export type ChryssoRawConfig = Record<string, ChryssoRawConfigValue>
export type ChryssoConfig = Record<string, ChryssoValue>
export type ChryssoOptions = {
  js2CssNameFormatter?: (jsName: string) => string,
  cssVarsInjector?: ChryssoInjector,
  onUpdate?: (config: ChryssoConfig, cssVars: ChryssoConfig, inject: ChryssoBoundInjector) => void,
}
