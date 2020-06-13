import { ChryssoRawConfig, ChryssoOptions, ChryssoConfig, ChryssoBoundInjector } from '../types'
import { resolveConfig, config2CssVars } from './core'

export class Chrysso {
  private _rawConfig: ChryssoRawConfig
  private _options: ChryssoOptions
  private _resolvedConfig: Readonly<ChryssoConfig>
  private _resolvedCssVars: Readonly<ChryssoConfig>
  private _injectFunction: ChryssoBoundInjector

  constructor(rawConfig: ChryssoRawConfig, options: any) {
    this._rawConfig = rawConfig
    this._options = options
    this.update(this._rawConfig)
  }

  update(rawConfig: ChryssoRawConfig) {
    this._rawConfig = rawConfig
    this._resolvedConfig = resolveConfig(this._rawConfig)

    const { cssVars, inject } = config2CssVars(this._resolvedConfig, this._options)
    this._resolvedCssVars = cssVars
    this._injectFunction = inject

    this._options.onUpdate(this._resolvedConfig, this._resolvedCssVars, inject)
  }

  getConfig() {
    return this._resolvedConfig
  }

  getCssVars() {
    return this._resolvedCssVars
  }

  inject(domEl: HTMLElement) {
    this._injectFunction(domEl)
  }
}
