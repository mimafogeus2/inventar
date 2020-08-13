import {
	Inventar,
	InventarConfig,
	InventarConfigValue,
	InventarEntryTuple,
	InventarOptions,
	InventarTester,
	InventarTransformedName,
	InventarTransformersSequence,
} from '../../types'
import { fieldDoesntExistYetError, ResolveError } from '../errors'
import { isDerivative, isEntryTuple, isTesterFunction, isTransformerObject, isValueObject } from '../utils'

const FILTER_NONE_REGEXP = /.*/

const createThrowIfEmptyFieldObject = (starterObject = {}) =>
	new Proxy(starterObject, {
		get: (target, prop) => {
			if (!target[prop]) {
				throw new Error(fieldDoesntExistYetError(prop))
			}
			return target[prop]
		},
	})

const testTuple = (tester: InventarTester, tuple: InventarEntryTuple) =>
	isTesterFunction(tester) ? tester(tuple) : tester.test(String(tuple[0]))

const createTuplesFromTransformers = (
	valueTuple: InventarEntryTuple,
	[currentTransformer, ...restOfTransformers]: InventarTransformersSequence = []
) => {
	if (!currentTransformer) {
		return [valueTuple]
	}

	const transformerFunction = isTransformerObject(currentTransformer)
		? currentTransformer.transformer
		: currentTransformer
	const transformerTest = (isTransformerObject(currentTransformer) && currentTransformer.test) || FILTER_NONE_REGEXP
	return testTuple(transformerTest, valueTuple)
		? transformerFunction(valueTuple).map(newTuple => createTuplesFromTransformers(newTuple, restOfTransformers))
		: [valueTuple]
}

const flattenTransformedTuples = (tuples, aggregator = []) =>
	tuples.reduce((agg, item) => {
		if (isEntryTuple(item)) {
			agg.push(item)
		} else {
			flattenTransformedTuples(item, aggregator)
		}
		return agg
	}, aggregator)

const resolve = (config: Inventar, value: InventarConfigValue | InventarTransformedName) =>
	isDerivative(value) ? value(config) : value
const resolveTuple = (config: Inventar, name: InventarTransformedName, value: InventarConfigValue) => [
	resolve(config, name),
	resolve(config, value),
]

export const resolveDependencies = (initialData: InventarConfig, options?: InventarOptions) => {
	const preTransformers = options?.preTransformers || []
	const postTransformers = options?.postTransformers || []
	const doesGlobalTransformersExist = !!(preTransformers?.length || postTransformers.length)

	const processQueue = Object.entries(initialData)

	// Not very nice - accessing resolvedConflict works as usual, accessing errorThrowingResolvedConfig throws an error
	// if the field doesn't exist <<in the same object>>.
	const resolvedConfig: Inventar = {}
	const errorThrowingResolvedConfig = createThrowIfEmptyFieldObject(resolvedConfig)
	const resolveWithConfig = resolveTuple.bind(null, errorThrowingResolvedConfig)

	let cycleDetect = 0

	while (processQueue.length && cycleDetect <= processQueue.length) {
		const currentPair = processQueue.shift()
		const [name, rawValue] = currentPair
		const value = isValueObject(rawValue) ? rawValue.value : rawValue

		try {
			if (doesGlobalTransformersExist || isValueObject(rawValue)) {
				const resolvedTuple = resolveWithConfig(name, value)
				const valueTransformers = (isValueObject(rawValue) && rawValue.transformers) || []
				const allTransformers = [...preTransformers, ...valueTransformers, ...postTransformers]
				const transformedValues = createTuplesFromTransformers(resolvedTuple, allTransformers)
				const flattenedTransformedValues = flattenTransformedTuples(transformedValues)
				flattenedTransformedValues.forEach(([newName, newValue]) => {
					resolvedConfig[newName] = newValue
				})
			} else {
				const [resolvedName, resolvedValue] = resolveWithConfig(name, value)

				resolvedConfig[resolvedName] = resolvedValue
			}

			cycleDetect = 0
		} catch (e) {
			processQueue.push(currentPair)
			cycleDetect += 1
		}
	}

	if (cycleDetect) {
		throw new Error(ResolveError())
	}

	return { ...resolvedConfig } as Inventar
}
