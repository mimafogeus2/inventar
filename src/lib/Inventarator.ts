import { Inventar, InventarBoundInjector, InventarConfig, InventarOptions } from '../types'
import { config2CssVars, resolveConfig } from './core'

// Temporary name. Will probably replace with a classless interface.
export class Inventarator {
  private rawConfig: InventarConfig
  private options: InventarOptions
  private resolvedConfig: Readonly<Inventar>
  private resolvedCssVars: Readonly<Inventar>
  private injectFunction: InventarBoundInjector

  constructor(rawConfig: InventarConfig, options: any) {
    this.rawConfig = rawConfig
    this.options = options
    this.update(this.rawConfig)
  }

  public update(rawConfig: InventarConfig): void {
    this.rawConfig = rawConfig
    this.resolvedConfig = resolveConfig(this.rawConfig)

    const { cssVars, inject } = config2CssVars(this.resolvedConfig, this.options)
    this.resolvedCssVars = cssVars
    this.injectFunction = inject

    this.options.onUpdate(this.resolvedConfig, this.resolvedCssVars, inject)
  }

  public getConfig(): Readonly<Inventar> {
    return this.resolvedConfig
  }

  public getCssVars(): Readonly<Inventar> {
    return this.resolvedCssVars
  }

  public inject(domEl: HTMLElement): void {
    this.injectFunction(domEl)
  }
}
