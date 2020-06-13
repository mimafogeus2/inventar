/** 
 * rawConfig -> [process] -> resolve -> done
 * 
 * processConfig takes care of value objects, plugins, and everything up to dependency resolving.
 */

import { ChryssoRawConfig, ChryssoProcessedConfig, ChryssoRawConfigValue, ChryssoProcessedValue } from '../../types'
import { isValueConfig } from '.'

const processValueObject = (rawValue: ChryssoRawConfigValue): ChryssoProcessedValue => {
  return isValueConfig(rawValue) ? rawValue.value : rawValue
}

export const processConfig = (rawConfig: ChryssoRawConfig): ChryssoProcessedConfig => {
  return Object.entries(rawConfig).reduce(
    (agg, [name, value]) => {
      const processedValue = processValueObject(value)
      agg[name] = processedValue
      return agg
    },
    {} as ChryssoProcessedConfig
  )
}
