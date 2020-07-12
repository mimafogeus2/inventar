import {
  ChryssoConfig,
  ChryssoOptions,
  ChryssoProcessedString,
  ChryssoProcessor,
  ChryssoRawConfig,
  ChryssoRawConfigValue,
  ChryssoValueTuple,
} from '../../types'
import { fieldDoesntExistYetError, ResolveError } from '../errors'
import { isDerivative, isValueConfig, isValueTuple } from '../utils'

const createThrowIfEmptyFieldObject = (starterObject = {}) => new Proxy(starterObject, {
  get: (target, prop) => {
    if (!target[prop]) {
      throw new Error(fieldDoesntExistYetError(prop))
    }
    return target[prop]
  }
})

const createTuplesFromProcessors = (valueTuple: ChryssoValueTuple, [processor, ...restOfProcessors]: ChryssoProcessor[] = []) => (
  processor
    ? processor(valueTuple).map(newTuple => createTuplesFromProcessors(newTuple, restOfProcessors))
    : [valueTuple]
)

 const flattenProcessedTuples = (tuples, aggregator = []) => (
   tuples.reduce((agg, item) => {
    if (isValueTuple(item)) {
      agg.push(item)
    } else {
      flattenProcessedTuples(item, aggregator)
    }
    return agg
   }, aggregator)
 )

const resolve = (config: ChryssoConfig, value: ChryssoRawConfigValue | ChryssoProcessedString) => (
  isDerivative(value) ? value(config) : value
)
const resolveTuple = (config: ChryssoConfig, name: ChryssoProcessedString, value: ChryssoRawConfigValue) => (
  [resolve(config, name), resolve(config, value)]
)

export const resolveDependencies = (initialData: ChryssoRawConfig, options?: ChryssoOptions) => {
  const preProcessors = options?.preProcessors || []
  const postProcessors = options?.postProcessors || []
  const doesGlobalProcessorsExist = !!(preProcessors?.length || postProcessors.length)

  const processQueue = Object.entries(initialData)

  // Not very nice - accessing resolvedConflict works as usual, accessing errorThrowingResolvedConfig throws an error
  // if the field doesn't exist <<in the same object>>.
  const resolvedConfig: ChryssoConfig = {}
  const errorThrowingResolvedConfig = createThrowIfEmptyFieldObject(resolvedConfig)
  const resolveWithConfig = resolveTuple.bind(null, errorThrowingResolvedConfig)

  let cycleDetect = 0;

  while (processQueue.length && cycleDetect <= processQueue.length) {
    const currentPair = processQueue.shift()
    const [name, rawValue] = currentPair
    const value = isValueConfig(rawValue) ? rawValue.value : rawValue

    try {
      if (doesGlobalProcessorsExist || isValueConfig(rawValue)) {
        const resolvedTuple = resolveWithConfig(name, value)
        const valueProcessors = (isValueConfig(rawValue) && rawValue.processors) || []
        const allProcessors = [...preProcessors, ...valueProcessors, ...postProcessors]
        const processedValues = createTuplesFromProcessors(resolvedTuple, allProcessors)
        const flattenedProcessedValues = flattenProcessedTuples(processedValues)
        flattenedProcessedValues.forEach(([newName, newValue]) => { resolvedConfig[newName] = newValue })
      } else {
        const [resolvedName, resolvedValue] = resolveWithConfig(name, value)

        resolvedConfig[resolvedName] = resolvedValue
      }  

      cycleDetect = 0
    } catch(e) {
      processQueue.push(currentPair)
      cycleDetect += 1
    }
  }

  if (cycleDetect) {
    throw new Error(ResolveError())
  }
  
  return { ...resolvedConfig } as ChryssoConfig
}
