import test from 'ava';

import { resolveConfig, config2CssVars } from '.'

const SIMPLE_CONFIG = { color: '#f00', anotherColor: () => '#0f0' }
const DEEP_DEPENDENCY_CONFIG = { color: '#0f0', color3: (config) => config.color2, color2: (config) => config.color }
const SIMPLE_RESOLVED_CONFIG = { primaryColor: '#f00' }

test('processConfig', (t) => {
  t.deepEqual(resolveConfig(SIMPLE_CONFIG), { color: '#f00', anotherColor: '#0f0' })
})

test('processConfig deep dependency', (t) => {
  t.deepEqual(resolveConfig(DEEP_DEPENDENCY_CONFIG), { color:'#0f0', color2: '#0f0', color3: '#0f0' })
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
