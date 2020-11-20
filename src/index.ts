import { makeInventar } from './lib'
import {
	camelCase2KebabCase,
	defaultToCssInventarOutput,
	defaultToInjectOutput,
	defaultToJsInventarOutput,
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
	// Default outputs
	defaultToCssInventarOutput,
	defaultToInjectOutput,
	defaultToJsInventarOutput,
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
