import { makeInventar } from './lib'
import { camelCase2KebabCase, injectCssVars, injectToRoot, isDerivative, isEntryTuple, isValueObject } from './lib/utils'
import {
  Inventar,
  InventarBoundInjector,
  InventarConfig,
  InventarInjector,
  InventarMakerOutput,
  InventarOptions,
  InventarTester,
  InventarTesterFunction,
  InventarTransformer,
  InventarTransformerObject,
  InventarTransformersSequence,
} from './types'

// Exports go here

export {
  // Injectors
  injectCssVars,
  injectToRoot,

  // Type checkers
  isDerivative,
  isEntryTuple,
  isValueObject,

  // Formatters
  camelCase2KebabCase,

  // Types
  Inventar,
  InventarBoundInjector,
  InventarConfig,
  InventarInjector,
  InventarMakerOutput,
  InventarOptions,
  InventarTester,
  InventarTesterFunction,
  InventarTransformer,
  InventarTransformerObject,
  InventarTransformersSequence,
}

// Main interface
export default makeInventar
