import { ChryssoConfig, ChryssoProcessedConfig } from '../../types'
import { circularDependencyError } from '../errors'
import { isDerivative } from '../utils'

const createThrowIfEmptyFieldObject = (starterObject = {}) => new Proxy(starterObject, {
  get: (target, prop) => {
    if (!target[prop]) {
      throw new Error(`${String(prop)} doesn't exist (yet?)`)
    }
    return target[prop]
  }
})

export const resolveDependencies = (initialData: ChryssoProcessedConfig) => {
  const processQueue = Object.entries(initialData)

  // Not very nice - accessing resolvedConflict works as usual, accessing errorThrowingResolvedConfig throws an error
  // if the field doesn't exist <<in the same object>>.

  const resolvedConfig: ChryssoProcessedConfig = {}
  const errorThrowingResolvedConfig = createThrowIfEmptyFieldObject(resolvedConfig)

  let cycleDetect = 0;

  while (processQueue.length && cycleDetect <= processQueue.length) {
    const currentPair = processQueue.shift()

    try {
      const [name, value] = currentPair
      
      const resolvedName = isDerivative(name) ? name(errorThrowingResolvedConfig) : name
      const resolvedValue = isDerivative(value) ? value(errorThrowingResolvedConfig) : value
      resolvedConfig[resolvedName] = resolvedValue

      cycleDetect = 0
    } catch(e) {
      processQueue.push(currentPair)
      cycleDetect += 1
    }
  }

  if (cycleDetect) {
    throw new Error(circularDependencyError)
  }
  
  return { ...resolvedConfig } as ChryssoConfig
}
