import { InventarBoundInjector, InventarConfig, InventarOptions, InventarRawConfig } from '../types'
import { config2CssVars, resolveConfig } from './core'

export class Inventar {
  private rawConfig: InventarRawConfig
  private options: InventarOptions
  private resolvedConfig: Readonly<InventarConfig>
  private resolvedCssVars: Readonly<InventarConfig>
  private injectFunction: InventarBoundInjector

  constructor(rawConfig: InventarRawConfig, options: any) {
    this.rawConfig = rawConfig
    this.options = options
    this.update(this.rawConfig)
  }

  public update(rawConfig: InventarRawConfig): void {
    this.rawConfig = rawConfig
    this.resolvedConfig = resolveConfig(this.rawConfig)

    const { cssVars, inject } = config2CssVars(this.resolvedConfig, this.options)
    this.resolvedCssVars = cssVars
    this.injectFunction = inject

    this.options.onUpdate(this.resolvedConfig, this.resolvedCssVars, inject)
  }

  public getConfig(): Readonly<InventarConfig> {
    return this.resolvedConfig
  }

  public getCssVars(): Readonly<InventarConfig> {
    return this.resolvedCssVars
  }

  public inject(domEl: HTMLElement): void {
    this.injectFunction(domEl)
  }
}
