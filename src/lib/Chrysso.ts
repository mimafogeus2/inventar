import { ChryssoBoundInjector, ChryssoConfig, ChryssoOptions, ChryssoRawConfig } from '../types'
import { config2CssVars, resolveConfig } from './core'

export class Chrysso {
  private rawConfig: ChryssoRawConfig
  private options: ChryssoOptions
  private resolvedConfig: Readonly<ChryssoConfig>
  private resolvedCssVars: Readonly<ChryssoConfig>
  private injectFunction: ChryssoBoundInjector

  constructor(rawConfig: ChryssoRawConfig, options: any) {
    this.rawConfig = rawConfig
    this.options = options
    this.update(this.rawConfig)
  }

  public update(rawConfig: ChryssoRawConfig): void {
    this.rawConfig = rawConfig
    this.resolvedConfig = resolveConfig(this.rawConfig)

    const { cssVars, inject } = config2CssVars(this.resolvedConfig, this.options)
    this.resolvedCssVars = cssVars
    this.injectFunction = inject

    this.options.onUpdate(this.resolvedConfig, this.resolvedCssVars, inject)
  }

  public getConfig(): Readonly<ChryssoConfig> {
    return this.resolvedConfig
  }

  public getCssVars(): Readonly<ChryssoConfig> {
    return this.resolvedCssVars
  }

  public inject(domEl: HTMLElement): void {
    this.injectFunction(domEl)
  }
}
