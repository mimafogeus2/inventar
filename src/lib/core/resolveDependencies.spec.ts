import test from 'ava';

import { ChryssoProcessor, ChryssoRawConfig } from '../../types'
import { ResolveError } from '../errors'
import { resolveDependencies } from './resolveDependencies'

const multiplyProcessor: ChryssoProcessor = ([name, value]: [string, number]) => [[name, value * 2]] // return derivatives instead
const repeatNameProcessor: ChryssoProcessor = ([name, value]) => [[`${name}_${name}`, value]]
const appendValueToNameProcessor: ChryssoProcessor = ([name, value]) => [[`${name}_${value}`, value]]
const duplicateValueProcessor: ChryssoProcessor = ([name, value]) => [[`${name}_1`, value], [`${name}_2`, value]]

const SIMPLE_CONFIG: ChryssoRawConfig = { a: 123 }
const DEPENDENCY_CONFIG: ChryssoRawConfig = { a: 123, b: config => config.a }
const DEEP_DEPENDENCY_CONFIG: ChryssoRawConfig = { a: 123, b: config => config.a, c: config => config.b }
const MULTIPLE_DEPENDENCY_CONFIG: ChryssoRawConfig = { a: 1, b: 2, c: config => (config.a as number) + (config.b as number) }
const CIRCULAR_DEPENDENCY_CONFIG: ChryssoRawConfig = { a: config => config.b, b: config => config.a }
const UNDEFINED_FIELD_REFERENCE_CONFIG: ChryssoRawConfig = { a: config => config.b }
const VALUE_OBJECT_NO_PROCESSORS_CONFIG: ChryssoRawConfig = { a: { value: 123 } }
const EMPTY_PROCESSOR_ARRAY_CONFIG: ChryssoRawConfig = { a: { value: 123, processors: [] } }
const SINGLE_PROCESSOR_CONFIG: ChryssoRawConfig = { a: { value: 123, processors: [multiplyProcessor] } }
const MULTIPLE_PROCESSORS_CONFIG: ChryssoRawConfig = { a: { value: 123, processors: [multiplyProcessor, multiplyProcessor] } }
const NAME_PROCESSOR_CONFIG: ChryssoRawConfig = { a: { value: 123, processors: [repeatNameProcessor] }}
const NAME_FROM_VALUE_PROCESSOR_CONFIG: ChryssoRawConfig = { a: { value: 123, processors: [appendValueToNameProcessor] }}
const MULTIPLE_VALUES_OUTPUT_PROCESSOR_CONFIG: ChryssoRawConfig = { a: { value: 123, processors: [duplicateValueProcessor] }}
const MULTIPLE_VALUES_OUTPUT_MULTIPLE_PROCESSORS_CONFIG: ChryssoRawConfig = {
  a: { value: 123, processors: [duplicateValueProcessor, duplicateValueProcessor] }
}
const DEPENDENCY_ON_PROCESSED_VALUE_CONFIG: ChryssoRawConfig = { a: config => config.b_b, b: { value: 123, processors: [repeatNameProcessor]}}
const SIMPLE_MULTIPLE_VALUES_CONFIG: ChryssoRawConfig = { a: 123, b: 234, c: 345 }

const PRE_PROCESSOR_OPTIONS = { preProcessors: [multiplyProcessor] }
const POST_PROCESSOR_OPTIONS = { postProcessors: [multiplyProcessor] }
const PRE_AND_POST_PROCESSOR_OPTIONS = { preProcessors: [multiplyProcessor], postProcessors: [multiplyProcessor] }

test('Simple resolve', (t) => {
  const obj = resolveDependencies(SIMPLE_CONFIG)
  t.is(obj.a, 123)
})

test('Dependency resolve', (t) => {
  const obj = resolveDependencies(DEPENDENCY_CONFIG)
  t.is(obj.a, 123)
  t.is(obj.b, 123)
})

test('Deep dependency resolve', (t) => {
  const obj = resolveDependencies(DEEP_DEPENDENCY_CONFIG)
  t.is(obj.a, 123)
  t.is(obj.b, 123)
  t.is(obj.c, 123)
})

test('Multiple dependency resolve', (t) => {
  const obj = resolveDependencies(MULTIPLE_DEPENDENCY_CONFIG)
  t.is(obj.c, 3)
})

test('Circular dependency resolve', (t) => {
  setTimeout(() => t.fail(), 1000)
  t.throws(() => resolveDependencies(CIRCULAR_DEPENDENCY_CONFIG), ResolveError())
})

test('Undefined field reference resolve', (t) => {
  setTimeout(() => t.fail(), 1000)
  t.throws(() => resolveDependencies(UNDEFINED_FIELD_REFERENCE_CONFIG), ResolveError())
})

test('Value object with no processors array resolve', (t) => {
  const obj = resolveDependencies(VALUE_OBJECT_NO_PROCESSORS_CONFIG)
  t.is(obj.a, 123)
})

test('Empty processor array resolve', (t) => {
  const obj = resolveDependencies(EMPTY_PROCESSOR_ARRAY_CONFIG)
  t.is(obj.a, 123)
})

test('Single processor resolve', (t) => {
  const obj = resolveDependencies(SINGLE_PROCESSOR_CONFIG)
  t.is(obj.a, 246)
})

test('Multiple processors resolve', (t) => {
  const obj = resolveDependencies(MULTIPLE_PROCESSORS_CONFIG)
  t.is(obj.a, 492)
})

test('Name processor resolve', (t) => {
  const obj = resolveDependencies(NAME_PROCESSOR_CONFIG)
  t.deepEqual(obj, { a_a: 123 })
})

test('Name derived from value processor resolve', (t) => {
  const obj = resolveDependencies(NAME_FROM_VALUE_PROCESSOR_CONFIG)
  t.deepEqual(obj, { a_123: 123 })
})

test('Multiple values from single processor resolve', (t) => {
  const obj = resolveDependencies(MULTIPLE_VALUES_OUTPUT_PROCESSOR_CONFIG)
  t.deepEqual(obj, { a_1: 123, a_2: 123 })
})

test('Multiple values from multiple processors resolve', (t) => {
  const obj = resolveDependencies(MULTIPLE_VALUES_OUTPUT_MULTIPLE_PROCESSORS_CONFIG)
  t.deepEqual(obj, { a_1_1: 123, a_1_2: 123, a_2_1: 123, a_2_2: 123 })
})

test('Dependency on processed value', (t) => {
  const obj = resolveDependencies(DEPENDENCY_ON_PROCESSED_VALUE_CONFIG)
  t.deepEqual(obj, { a: 123, b_b: 123 })
})

test('Pre-processor resolve', (t) => {
  const obj = resolveDependencies(SIMPLE_MULTIPLE_VALUES_CONFIG, PRE_PROCESSOR_OPTIONS)
  t.deepEqual(obj, { a: 246, b: 468, c: 690 })
})

test('Post-processor resolve', (t) => {
  const obj = resolveDependencies(SIMPLE_MULTIPLE_VALUES_CONFIG, POST_PROCESSOR_OPTIONS)
  t.deepEqual(obj, { a: 246, b: 468, c: 690 })
})

test('Pre-, value and post- processors resolve', (t) => {
  const obj = resolveDependencies(SINGLE_PROCESSOR_CONFIG, PRE_AND_POST_PROCESSOR_OPTIONS)
  t.deepEqual(obj, { a: 984 })
})
