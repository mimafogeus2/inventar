import test from 'ava';

import { processConfig } from './processConfig'

const SIMPLE_CONFIG = { a: 123 }
const VALUE_OBJECT_CONFIG = { a: { value: 123 } }

test('process config with no value objects', (t) => {
  t.deepEqual(processConfig(SIMPLE_CONFIG), { a: 123 })
})

test('process config with value object', (t) => {
  t.deepEqual(processConfig(VALUE_OBJECT_CONFIG), { a: 123 })
})
