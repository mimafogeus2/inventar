import test from 'ava';

import { isDerivative, mergeOptionsWithDefaults, DEFAULT_OPTIONS } from '.'

test('mergeOptionsWithDefaults, empty object', (t) => {
  t.deepEqual(mergeOptionsWithDefaults({}), DEFAULT_OPTIONS)
})

test('mergeOptionsWithDefaults, overrides', (t) => {
  const customNameFormatter = str => str
  t.deepEqual(mergeOptionsWithDefaults(
    { js2CssNameFormatter: customNameFormatter }),
    { ...DEFAULT_OPTIONS, js2CssNameFormatter: customNameFormatter }
  )
})

test('isDerivative', (t) => {
  t.is(isDerivative(() => 1), true)
  t.is(isDerivative('123'), false)
  t.is(isDerivative(123), false)
  t.is(isDerivative(true), false)
  t.is(isDerivative({}), false)
  t.is(isDerivative([]), false)
  t.is(isDerivative(null), false)
  t.is(isDerivative(undefined), false)
})