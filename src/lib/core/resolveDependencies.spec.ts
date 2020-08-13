import test from 'ava'

import { InventarConfig, InventarTransformer } from '../../types'
import { ResolveError } from '../errors'
import { resolveDependencies } from './resolveDependencies'

const multiplyTransformer: InventarTransformer = ([name, value]: [string, number]) => [[name, value * 2]] // return derivatives instead
const repeatNameTransformer: InventarTransformer = ([name, value]) => [[`${name}_${name}`, value]]
const appendValueToNameTransformer: InventarTransformer = ([name, value]) => [[`${name}_${value}`, value]]
const duplicateValueTransformer: InventarTransformer = ([name, value]) => [
	[`${name}_1`, value],
	[`${name}_2`, value],
]

const SIMPLE_CONFIG: InventarConfig = { a: 123 }
const SIMPLE_MULTIPLE_VALUES_CONFIG: InventarConfig = { a: 123, b: 234, c: 345 }
const DEPENDENCY_CONFIG: InventarConfig = { a: 123, b: config => config.a }
const DEEP_DEPENDENCY_CONFIG: InventarConfig = { a: 123, b: config => config.a, c: config => config.b }
const MULTIPLE_DEPENDENCY_CONFIG: InventarConfig = {
	a: 1,
	b: 2,
	c: config => (config.a as number) + (config.b as number),
}
const CIRCULAR_DEPENDENCY_CONFIG: InventarConfig = { a: config => config.b, b: config => config.a }
const UNDEFINED_FIELD_REFERENCE_CONFIG: InventarConfig = { a: config => config.b }
const VALUE_OBJECT_NO_TRANSFORMERS_CONFIG: InventarConfig = { a: { value: 123 } }
const EMPTY_TRANSFORMER_ARRAY_CONFIG: InventarConfig = { a: { value: 123, transformers: [] } }
const SINGLE_TRANSFORMER_CONFIG: InventarConfig = { a: { value: 123, transformers: [multiplyTransformer] } }
const MULTIPLE_TRANSFORMERS_CONFIG: InventarConfig = {
	a: { value: 123, transformers: [multiplyTransformer, multiplyTransformer] },
}
const NAME_TRANSFORMER_CONFIG: InventarConfig = { a: { value: 123, transformers: [repeatNameTransformer] } }
const NAME_FROM_VALUE_TRANSFORMER_CONFIG: InventarConfig = {
	a: { value: 123, transformers: [appendValueToNameTransformer] },
}
const MULTIPLE_VALUES_OUTPUT_TRANSFORMER_CONFIG: InventarConfig = {
	a: { value: 123, transformers: [duplicateValueTransformer] },
}
const MULTIPLE_VALUES_OUTPUT_MULTIPLE_TRANSFORMERS_CONFIG: InventarConfig = {
	a: { value: 123, transformers: [duplicateValueTransformer, duplicateValueTransformer] },
}
const DEPENDENCY_ON_TRANSFORMED_VALUE_CONFIG: InventarConfig = {
	a: config => config.b_b,
	b: { value: 123, transformers: [repeatNameTransformer] },
}
const TRANSFORMER_CONFIG_CONFIG: InventarConfig = {
	a: { value: 123, transformers: [{ transformer: multiplyTransformer }] },
}

const PRE_TRANSFORMER_OPTIONS = { preTransformers: [multiplyTransformer] }
const POST_TRANSFORMER_OPTIONS = { postTransformers: [multiplyTransformer] }
const PRE_AND_POST_TRANSFORMER_OPTIONS = {
	preTransformers: [multiplyTransformer],
	postTransformers: [multiplyTransformer],
}
const TRANSFORMER_CONFIG_TEST_FUNCTION_OPTIONS = {
	preTransformers: [{ transformer: multiplyTransformer, test: tuple => tuple[0] !== 'c' }],
}
const TRANSFORMER_CONFIG_TEST_REGEXP_OPTIONS = {
	preTransformers: [{ transformer: multiplyTransformer, test: /^[ab].*/ }],
}

test('Simple resolve', t => {
	const obj = resolveDependencies(SIMPLE_CONFIG)
	t.is(obj.a, 123)
})

test('Dependency resolve', t => {
	const obj = resolveDependencies(DEPENDENCY_CONFIG)
	t.is(obj.a, 123)
	t.is(obj.b, 123)
})

test('Deep dependency resolve', t => {
	const obj = resolveDependencies(DEEP_DEPENDENCY_CONFIG)
	t.is(obj.a, 123)
	t.is(obj.b, 123)
	t.is(obj.c, 123)
})

test('Multiple dependency resolve', t => {
	const obj = resolveDependencies(MULTIPLE_DEPENDENCY_CONFIG)
	t.is(obj.c, 3)
})

test('Circular dependency resolve', t => {
	setTimeout(() => t.fail(), 1000)
	t.throws(() => resolveDependencies(CIRCULAR_DEPENDENCY_CONFIG), ResolveError())
})

test('Undefined field reference resolve', t => {
	setTimeout(() => t.fail(), 1000)
	t.throws(() => resolveDependencies(UNDEFINED_FIELD_REFERENCE_CONFIG), ResolveError())
})

test('Value object with no transformers array resolve', t => {
	const obj = resolveDependencies(VALUE_OBJECT_NO_TRANSFORMERS_CONFIG)
	t.is(obj.a, 123)
})

test('Empty transformer array resolve', t => {
	const obj = resolveDependencies(EMPTY_TRANSFORMER_ARRAY_CONFIG)
	t.is(obj.a, 123)
})

test('Single transformer resolve', t => {
	const obj = resolveDependencies(SINGLE_TRANSFORMER_CONFIG)
	t.is(obj.a, 246)
})

test('Multiple transformers resolve', t => {
	const obj = resolveDependencies(MULTIPLE_TRANSFORMERS_CONFIG)
	t.is(obj.a, 492)
})

test('Name transformer resolve', t => {
	const obj = resolveDependencies(NAME_TRANSFORMER_CONFIG)
	t.deepEqual(obj, { a_a: 123 })
})

test('Name derived from value transformer resolve', t => {
	const obj = resolveDependencies(NAME_FROM_VALUE_TRANSFORMER_CONFIG)
	t.deepEqual(obj, { a_123: 123 })
})

test('Multiple values from single transformer resolve', t => {
	const obj = resolveDependencies(MULTIPLE_VALUES_OUTPUT_TRANSFORMER_CONFIG)
	t.deepEqual(obj, { a_1: 123, a_2: 123 })
})

test('Multiple values from multiple transformers resolve', t => {
	const obj = resolveDependencies(MULTIPLE_VALUES_OUTPUT_MULTIPLE_TRANSFORMERS_CONFIG)
	t.deepEqual(obj, { a_1_1: 123, a_1_2: 123, a_2_1: 123, a_2_2: 123 })
})

test('Dependency on transformed value', t => {
	const obj = resolveDependencies(DEPENDENCY_ON_TRANSFORMED_VALUE_CONFIG)
	t.deepEqual(obj, { a: 123, b_b: 123 })
})

test('Simple transformer config resolve', t => {
	const obj = resolveDependencies(TRANSFORMER_CONFIG_CONFIG)
	t.deepEqual(obj, { a: 246 })
})

test('Pre-transformer resolve', t => {
	const obj = resolveDependencies(SIMPLE_MULTIPLE_VALUES_CONFIG, PRE_TRANSFORMER_OPTIONS)
	t.deepEqual(obj, { a: 246, b: 468, c: 690 })
})

test('Post-transformer resolve', t => {
	const obj = resolveDependencies(SIMPLE_MULTIPLE_VALUES_CONFIG, POST_TRANSFORMER_OPTIONS)
	t.deepEqual(obj, { a: 246, b: 468, c: 690 })
})

test('Pre-, value and post- transformers resolve', t => {
	const obj = resolveDependencies(SINGLE_TRANSFORMER_CONFIG, PRE_AND_POST_TRANSFORMER_OPTIONS)
	t.deepEqual(obj, { a: 984 })
})

test('Transformer test function resolve', t => {
	const obj = resolveDependencies(SIMPLE_MULTIPLE_VALUES_CONFIG, TRANSFORMER_CONFIG_TEST_FUNCTION_OPTIONS)
	t.deepEqual(obj, { a: 246, b: 468, c: 345 })
})

test('Transformer test regexp resolve', t => {
	const obj = resolveDependencies(SIMPLE_MULTIPLE_VALUES_CONFIG, TRANSFORMER_CONFIG_TEST_REGEXP_OPTIONS)
	t.deepEqual(obj, { a: 246, b: 468, c: 345 })
})
