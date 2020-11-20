import test from 'ava'

import {
	defaultToInjectOutput,
	DEFAULT_OPTIONS,
	isBoundInjector,
	isDerivative,
	isEntryTuple,
	isTesterFunction,
	isTransformerObject,
	isValueTransformersOnlyObject,
	mergeOptionsWithDefaults,
} from '.'
import { resolveConfig } from '../core'

test('mergeOptionsWithDefaults, empty object', t => {
	t.deepEqual(mergeOptionsWithDefaults({}), DEFAULT_OPTIONS)
})

test('mergeOptionsWithDefaults, overrides', t => {
	const customNameFormatter = str => str
	t.deepEqual(mergeOptionsWithDefaults({ js2CssNameFormatter: customNameFormatter }), {
		...DEFAULT_OPTIONS,
		js2CssNameFormatter: customNameFormatter,
	})
})

test('isDerivative', t => {
	t.is(
		isDerivative(() => 1),
		true
	)
	t.is(isDerivative('123'), false)
	t.is(isDerivative(123), false)
	t.is(isDerivative(true), false)
	t.is(isDerivative({}), false)
	t.is(isDerivative([]), false)
	t.is(isDerivative(null), false)
	t.is(isDerivative(undefined), false)
})

test('Default injector function', t => {
	const myInventar = resolveConfig({ oneParam: 1 })
	const defaultInjector = defaultToInjectOutput(myInventar, DEFAULT_OPTIONS)
	const domEl = document.createElement('div')

	if (isBoundInjector(defaultInjector)) {
		defaultInjector(domEl)
	}

	const domElementStyle = domEl.getAttribute('style')
	t.is(domElementStyle, '--one-param: 1')
})

test('isEntryTuple', t => {
	t.is(isEntryTuple(['a', 1]), true)
	t.is(isEntryTuple(['a', 'b']), true)
	t.is(isEntryTuple([undefined, 'b']), false)
	t.is(isEntryTuple(['a', undefined]), false)
	t.is(isEntryTuple({}), false)
	t.is(isEntryTuple(1), false)
	t.is(isEntryTuple(null), false)
})

test('isValueTransformersOnlyObject', t => {
	t.is(isValueTransformersOnlyObject({ transformers: [() => []] }), true)
	t.is(isValueTransformersOnlyObject({ transformers: [] }), false)
	t.is(isValueTransformersOnlyObject({ value: 1, transformers: [() => []] }), false)
	t.is(isValueTransformersOnlyObject({ transformers: {} }), false)
	t.is(isValueTransformersOnlyObject({ transformers: 1 }), false)
	t.is(isValueTransformersOnlyObject({ transformers: undefined }), false)
	t.is(isValueTransformersOnlyObject({}), false)
	t.is(isValueTransformersOnlyObject(1), false)
	t.is(isValueTransformersOnlyObject(null), false)
})

test('isTransformerObject', t => {
	t.is(isTransformerObject({ transformer: () => [] }), true)
	t.is(isTransformerObject({}), false)
	t.is(isTransformerObject(1), false)
	t.is(isTransformerObject(null), false)
})

test('isTesterFunction', t => {
	t.is(
		isTesterFunction(() => {}),
		true
	)
	t.is(isTesterFunction(1), false)
	t.is(isTesterFunction(null), false)
})

test('isBoundInjector', t => {
	t.is(
		isBoundInjector(() => {}),
		true
	)
	t.is(isBoundInjector(1), false)
	t.is(isBoundInjector(null), false)
})
