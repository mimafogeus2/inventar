import test from 'ava';

import { resolveDependencies } from './resolveDependencies'
import { COUNTER_FIELD_NAME, OBJECT_LENGTH_FIELD_NAME } from './resolveDependencies'
import { circularDependencyError } from '../errors'

const SIMPLE_CONFIG = { a: 123 }
const DEPENDENCY_CONFIG = { a: 123, b: config => config.a }
const DEEP_DEPENDENCY_CONFIG = { a: 123, b: config => config.a, c: config => config.b }
const MULTIPLE_DEPENDENCY_CONFIG = { a: 1, b: 2, c: config => config.a + config.b }
const CIRCULAR_DEPENDENCY_CONFIG = { a: config => config.b, b: config => config.a }
const CONFIG_WITH_INTERNAL_FIELDS = { a: 123, [COUNTER_FIELD_NAME]: 0, [OBJECT_LENGTH_FIELD_NAME]: 1 }

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
  t.throws(() => resolveDependencies(CIRCULAR_DEPENDENCY_CONFIG), circularDependencyError)
})

test('Internal fields inenumerability', (t) => {
  const obj = resolveDependencies(CONFIG_WITH_INTERNAL_FIELDS)
  t.deepEqual(obj, { a: 123 })
})