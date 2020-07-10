import test from 'ava';

import { config2CssVars, resolveConfig } from '.'

const SIMPLE_CONFIG = { color: '#f00', anotherColor: () => '#0f0' }
const SIMPLE_RESOLVED_CONFIG = { primaryColor: '#f00' }

test('resolveConfig', (t) => {
  const resolvedConfig = resolveConfig(SIMPLE_CONFIG)
  t.deepEqual(resolvedConfig, { color: '#f00', anotherColor: '#0f0' })
  t.is(Object.isFrozen(resolvedConfig), true)
})

test('config2CssVars, default options', (t) => {
  t.deepEqual(config2CssVars(SIMPLE_RESOLVED_CONFIG).cssVars, { '--primary-color': '#f00' })
})

test('config2CssVars, custom name formatter', (t) => {
  t.deepEqual(
    config2CssVars(
      SIMPLE_RESOLVED_CONFIG,
      { js2CssNameFormatter: str => str.toUpperCase() }
    ).cssVars,
    { '--PRIMARYCOLOR': '#f00' }
  )
})
