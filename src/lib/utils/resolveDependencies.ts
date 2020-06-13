import { isDerivative } from '.'
import { circularDependencyError } from '../errors'
import { ChryssoProcessedConfig } from '../../types'

export const COUNTER_FIELD_NAME = '_LAZY_EVAN_OBJECT_COUNTER'
export const OBJECT_LENGTH_FIELD_NAME = '_LENGTH'

const initializeStarterObject = (obj) => {
  Object.defineProperty(obj, COUNTER_FIELD_NAME, { value: 0, enumerable: false, writable: true })
  Object.defineProperty(obj, OBJECT_LENGTH_FIELD_NAME, { value: Object.keys(obj).length, enumerable: false, writable: true })

  return obj
}

const get = (target, prop, receiver) => {
  const value = target[prop]

  if (target[COUNTER_FIELD_NAME] === target[OBJECT_LENGTH_FIELD_NAME]) {
    throw new Error(circularDependencyError)
  }
  if (prop === COUNTER_FIELD_NAME || prop === OBJECT_LENGTH_FIELD_NAME) {
    return value
  }
  if (isDerivative(value)) {
    target[COUNTER_FIELD_NAME] += 1
    receiver[prop] = value(receiver)
  }

  target[COUNTER_FIELD_NAME] = 0

  return target[prop]
}

const createLazyEvalObject = (startObj = {}) => new Proxy(initializeStarterObject(startObj), { get })

// Object.values accesses all values. Value access from LazyEvalObject resolves it, so this resolved everything.
const mutableResolveLazyEvalObject = (lazyEvalObj) => { Object.values(lazyEvalObj) }

export const resolveDependencies = (starterObj: ChryssoProcessedConfig) => {
  const lazyEvalObj = createLazyEvalObject(starterObj)
  mutableResolveLazyEvalObject(lazyEvalObj)

  return { ...lazyEvalObj }
}
