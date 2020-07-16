import {
  InventarConfig,
  InventarOptions,
  InventarProcessedString,
  InventarProcessors,
  InventarRawConfig,
  InventarRawConfigValue,
  InventarTest,
  InventarValueTuple,
} from '../../types'
import { fieldDoesntExistYetError, ResolveError } from '../errors'
import { isDerivative, isProcessorConfig, isTestFunction, isValueConfig, isValueTuple } from '../utils'

const FILTER_NONE_REGEXP = /.*/

const createThrowIfEmptyFieldObject = (starterObject = {}) => new Proxy(starterObject, {
  get: (target, prop) => {
    if (!target[prop]) {
      throw new Error(fieldDoesntExistYetError(prop))
    }
    return target[prop]
  }
})

const testTuple = (tester: InventarTest, tuple: InventarValueTuple) => (
  isTestFunction(tester) ? tester(tuple) : tester.test(String(tuple[0]))
)

const createTuplesFromProcessors = (valueTuple: InventarValueTuple, [currentProcessor, ...restOfProcessors]: InventarProcessors = []) => {
  if (!currentProcessor) {
    return [valueTuple]
  }

  const processorFunction = isProcessorConfig(currentProcessor) ? currentProcessor.processor : currentProcessor
  const processorTest = (isProcessorConfig(currentProcessor) && currentProcessor.test) || FILTER_NONE_REGEXP
  return testTuple(processorTest, valueTuple)
    ? processorFunction(valueTuple).map(newTuple => createTuplesFromProcessors(newTuple, restOfProcessors))
    : [valueTuple]
}

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

const resolve = (config: InventarConfig, value: InventarRawConfigValue | InventarProcessedString) => (
  isDerivative(value) ? value(config) : value
)
const resolveTuple = (config: InventarConfig, name: InventarProcessedString, value: InventarRawConfigValue) => (
  [resolve(config, name), resolve(config, value)]
)

export const resolveDependencies = (initialData: InventarRawConfig, options?: InventarOptions) => {
  const preProcessors = options?.preProcessors || []
  const postProcessors = options?.postProcessors || []
  const doesGlobalProcessorsExist = !!(preProcessors?.length || postProcessors.length)

  const processQueue = Object.entries(initialData)

  // Not very nice - accessing resolvedConflict works as usual, accessing errorThrowingResolvedConfig throws an error
  // if the field doesn't exist <<in the same object>>.
  const resolvedConfig: InventarConfig = {}
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
  
  return { ...resolvedConfig } as InventarConfig
}
