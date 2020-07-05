/** 
 * rawConfig -> [process] -> resolve -> done
 * 
 * processConfig takes care of value objects, plugins, and everything up to dependency resolving.
 */

import {
  ChryssoProcessedConfigTuples,
  ChryssoProcessedValue,
  ChryssoRawConfig,
  ChryssoRawConfigValue
} from '../../types'
import { isValueConfig } from '../utils'

const processValueObject = (rawValue: ChryssoRawConfigValue): ChryssoProcessedValue => {
  return isValueConfig(rawValue) ? rawValue.value : rawValue
}

export const processConfig = (rawConfig: ChryssoRawConfig): ChryssoProcessedConfigTuples => {
  return Object.entries(rawConfig).reduce(
    (agg, [name, value]) => {
      const processedValue = processValueObject(value)
      agg.push([name, processedValue])
      return agg
    },
    [] as ChryssoProcessedConfigTuples
  )
}
