import test from 'ava'

import { InventarConfig } from '../types'
import { makeInventar } from './'
import { isBoundInjector } from './utils'

const SIMPLE_CONFIG: InventarConfig = { a: 123 }

test('makeInventar, default options', (t) => {
  const inventar = makeInventar(SIMPLE_CONFIG)
  t.deepEqual(inventar.jsInventar, { a: 123 })
  t.deepEqual(inventar.cssInventar, { '--a': 123 })
  t.true(isBoundInjector(inventar.inject))
})

test('makeInventar, no CSS', (t) => {
  const inventar = makeInventar(SIMPLE_CONFIG, { shouldMakeCssInventar: false })
  t.deepEqual(inventar, { jsInventar: { a: 123 } })
})
