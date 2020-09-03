import { makeInventar } from './lib'
import {
	camelCase2KebabCase,
	injectToRoot,
	injectToStyle,
	isDerivative,
	isEntryTuple,
	isValueObject,
} from './lib/utils'
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
	InventarTransformerHoc,
	InventarTransformerObject,
	InventarTransformersSequence,
} from './types'

// Exports go here

export {
	makeInventar,
	// Injectors
	injectToStyle,
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
	InventarTransformerHoc,
	InventarTransformerObject,
	InventarTransformersSequence,
}

// Main interface
export default makeInventar
