# Inventar

The nicest, most organized TS/JS single source of truth for your style variables (and more!)



## Table of Contents

- [Inventar](#inventar)
  - [Table of Contents](#table-of-contents)
  - [What Does It Do?](#what-does-it-do)
  - [Why?](#why)
  - [Quickstart](#quickstart)
  - [Configurations (And How To Write Them)](#configurations-and-how-to-write-them)
    - [Derivatives](#derivatives)
      - [What happens behind the scenes?](#what-happens-behind-the-scenes)
    - [Options](#options)
  - [Transformers](#transformers)
    - [Value-Specific Transformers](#value-specific-transformers)
    - [Global Transformers](#global-transformers)
  - [Custom Outputs](#custom-outputs)
  - [Contribute](#contribute)



## What Does It Do?

Inventar takes in a configuration object with all of your style variables - colors, sizes, URIs and anything else you might find as a CSS value, or a part of it. 

This configuration can define which values are derived from other values, and can include transformers - simple plugins - to alter or generate variables as needed. This can be written with pure functions, to allow a well-contained, easily readable and powerful way to define your style variables.

It returns the result as a flat JS object, and a function to inject these same values as CSS variables to a DOM element.

```javascript
import { makeInventar } from 'inventar'

const MY_INVENTAR_CONFIG = {
  mainColor: '#007788',
  mainText: (config) => config.mainColor,
  logoUri: { value: '/assets/logo.png', transformers: [withHighRes()] }, 
}

const { jsInventar, cssInventar, inject } = makeInventar(MY_INVENTAR_CONFIG)

console.log(jsInventar)
/**
  {
    mainColor: '#007788',
    mainText: '#007788',
    logoUri: '/assets/logo.png',
    logoUriX2: '/assets/logo@2x.png'
  }
**/

console.log(cssInventar)
/**
  {
    '--main-color': '#007788',
    '--main-text': '#007788',
    '--logo-uri': '/assets/logo.png',
    '--logo-uri-x2': '/assets/logo@2x.png'
  }
**/

const appWrapper = document.getElementsByClassName('appWrapper')[0]
inject(appWrapper) // <div class="appWrapper" style="--main-color: '#007788', ..." />
```



## Why?

* __Single source of truth__ for all of your styles, accessible both in JS and with any styling language or methodology you work with.
* __Separation of concerns__ makes it easier to write related plugins, linters, and any related logic, and reuse others' - no matter what's their stack.
* __Enforce design guidelines__ by defining variables by other variables, and by pairing with designers to define them in a single file.



## Quickstart

1. Install Inventar (`npm install inventar`).

2. Run `makeInventar` with your [configuration](#Configurations-and-how-to-write-them):

   ```javascript
   import { makeInventar } from 'inventar'
   
   const MY_INVENTAR_CONFIG = {
     mainColor: '#007788',
     mainText: (config) => config.mainColor,
   }
   
   const { jsInventar, cssInventar, inject } = makeInventar(MY_INVENTAR_CONFIG)
   ```

3. To access your variables in JavaScript or TypeScript:

   ```javascript
   jsInventar.mainText // #007788
   ```

4. To add them as CSS variable, inject them to a wrapping object:

   ```javascript
   const appWrapper = document.getElementsByClassName('appWrapper')[0]
   inject(appWrapper)
   ```



## Configurations (And How To Write Them)

The first, and only mandatory, argument that you pass to `makeInventar` is your __configuration__. A configuration is an object that defines all of your style variables - colors, sizes, URIs, background settings, numbers and anything else you'd find as, or as a part of, CSS values.

A value can be a __number__, a __string__, a __derivative function__ (see [derivatives](#derivatives)) or an __object__ containing the value and related options:

```javascript
const { jsInventar, inject } = makeInventar({
  gray: '#888',
  headerHeight: 180,
  headerBackground: config => config.gray,
  logoUri: { value: '/assets/logo.png', transformers: [withHighRes()] },
})
```



The object will have the following structure, and it __must__ either:

- Include a value (`{ value: '' }`) (and optionally any number of transformers).
- Include at least one transformer, with the first one not requiring an initial value
  (`{ transformers: [transformerWithNoValueInput, ...] }`).

| Field            | Type                                                     | Default Value | Description                                                  |
| ---------------- | -------------------------------------------------------- | --------- | ------------- | ------------------------------------------------------------ |
| __value__        | `number | string | inventarDerivative`                   | -             | The value of the field (same one you'd put outside of the object). |
| __transformers__ | `Array(inventarTransformer | inventarTransformerObject`) | `[]`          | An array of transformers (see [transformers](#transformers)) to alter the value. |



### Derivatives

A __derivative__ is a function of the type `(config: InventarConfig) => (number | string)`. The purpose is to __derive__ (eh?) a value from other values,. It can be used to generate a value with any other logic as well.

Some use cases include:

```javascript
import tinycolor from 'tinycolor2'

{
  // Separation between "primitive" values and their uses.
  mainErrorColor: '#ff2200',
  errorMessage: config => config.mainErrorColor,
	
  // Handling hover/focus/active events.
  linkColor: '#4455ff',
  linkHoverColor: config => tinyColor(config.linkColor).brighten(30).toString(),
	
	// Picking a color according to a theme.
  themeName: () => {
    const currentHour = Date().getHours()
    return (currentHour <= 5 || currentHour >= 19) ? 'dark' : 'light'
  },
  backgroundColor: (config) => config.themeName === 'dark' ? '#001122' : '#ffeedd',
}
```

Derivatives can use multiple values. They can also call other derivatives, and order them in any way you'd like - Inventar takes care to resolve everything in the right order.

Circular values cannot be handled. Inventar can detect them, and it'll throw an error if it does.

```javascript
{
  // This is okay!
  largeMargin: config => config.mediumMargin * 2,
  mediumMargin: config => config.smallMargin * 2,
  smallMargin: 2,

  // This is a circular dependency, and it'll get you an error.
  chicken: config => config.egg,
  egg: config.chicken,
}
```



#### What happens behind the scenes?

_(You can also check the [code](https://github.com/mimafogeus2/inventar/blob/master/src/lib/core/resolveDependencies.ts#L63) that does this)_

Your configuration is passed to Inventar's dependency resolver. After handling the [transformers](#transformers), when the configuration contains only numbers, strings and derivatives as values, it creates a [proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) around it.

It then creates a queue of name-value pairs, and starts a loop.

In each iteration, the first value in the queue is popped and the resolver tries to resolve it. If the object is not a derivative, then it is already resolved, and is removed from the queue. If the value is a derivative, the resolver executes it with the proxied configuration as a parameter.

Using a proxy allows us to run logic when a value is called. If the function calls a value and it's a derivative, then, instead of being resolved, the tested name-value pair is returned to the end of the queue. This assumes that by the next time we'll try to run the derivative value, whatever other values it'll call will be resolved already.

When a value is successfully resolved, the proxied configuration will be mutated with the result, making it accessible to future derivatives.

This loop continues until the queue is empty (in which case it's completely resolved) or when a loop is detected (in which case you'll get a circular dependency error).



### Options

`makeInventar` accepts a second, optional argument, with options.

These are all optional.

| option              | type                                                         | default                                                      | description                                                  |
| ------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| cssVarsInjector     | `(cssVarsConfig:inventarConfig, domEl: HTMLElement) => void` | `injectToStyle`                                              | Overrides the way CSS vars are injected to a DOM element when `inject` is used. Two functions are provided - **`injectToStyle`**, which adds CSS variables as inline styles and allows you to choose which DOM element will be injected, and **`injectToRoot`** which adds them to the document body with `setProperty` and is more backward compatible. You can also write your own. |
| js2CssNameFormatter | `(jsName:string) => string`                                  | `camelCase2KebabCase`                                        | Formats JS variable names are to css variable names.         |
| outputs             | ```Array<InventarOutputFunction \| InventarOutput>```    | ```{ jsInventar, cssInventar, inject }```, as per this documentation. | Overrides the default output formats. See [Custom Outputs](#custom-outputs) for more details. |
| preTransformers     | `InventarTransformersSequence`                               | `[]`                                                         | A sequence of transformers to be executed on every variable, before its own transformers run. |
| postTransformers    | `InventarTransformersSequence`                               | `[]`                                                         | A sequence of transformers to be executed on every variable, after its own transformers run. |



## Transformers

__Transformers__ are the plugins of the Inventar system. They accept one, some or all variables and can alter, remove or create new ones from them.

An `InventarTransformer` is a function of the type: `([varName, varValue]) => [varName, varValue][]`. It (optionally) accepts a tuple representing a single variable (name and value), and returns an array of zero or more such tuples.
To get parameters for a transformer, we recommend creating a HOC to accept them and return an `InventarTransformer`.

```JavaScript
const doubleValue = ([name, value]) => [[name, value * 2]]
const multiplyBy = (by: number) => ([name, value]) => [[name, value * by]]

// This transformer doesn't use a value. You can use it as a first transformer instead of having a value field in a value object.
const colorByHour = () => {
  const hour = (new Date()).getHours()
  return 7 < hour && hour < 18 ? '#eee' : '#111'
}
```

When providing transformers (See [Value-Specific Transformers](#Value-Specific Transformers) and [Global Transformers](#Global Transformers))), you'll be asked to provide them in a sequence - an array - and they'll be executed in order.

Each item in this sequence can either be an `InventarTransformer`, or an object of the following structure:

| Field           | Type                                 | Required? | Default Value | Description                                                  |
| --------------- | ------------------------------------ | --------- | ------------- | ------------------------------------------------------------ |
| __transformer__ | `InventarTransformer`                | Yes       | -             | A transformer function.                                      |
| __test__        | `regex | ([name ,value]) => boolean` | No        | `undefined`   | A regex to test a value, or a function to test a name and value tuple. The transformer will only be executed on items that where the provided test returns true.<br />This is mainly useful in [Global Transformers](#Global Transformers). |



### Value-Specific Transformers

A transformer that's applied to a single variable is a __value-specific transformer__. It is provided as a field in a [value object](#Configurations-and-how-to-write-them).

```javascript
const MY_INVENTAR_CONFIG = {
  transformedVariable: { value: 100, transformers[doubleValue, multiplyBy(3), ...] }, // { transformedVariable: 600 }
}
```



### Global Transformers

Global transformers are provided in the [options](#Options) object, and will transform all variables (or some, if a test argument is provided).

You can provide two transformer sequences - `preTransformers` and `postTransformers`, which vary by their order of execution; `preTransformers` are executed first, then value-specific transformers, and then `postTransformers`.

```javascript
const INVENTAR_OPTIONS = {
  preTransformers: [doThisFirst],
  postTransformers: [
    { transformer: doThisLastOnColors, test: ([name, value]) => name.toLowerCase().includes('color') }
  ],
}
```



## Custom Outputs

By default `makeInventar` outputs three items:

* `jsInventar` - A JavaScript object that is the direct output of `makeInventar`. It should be used with JS styling libraries or when JS logics needs to access your Inventar.
* `cssInventar` - Similar to `jsInventar`, but with its keys formatted in the css variables convention (`myKey` -> `--my-key`). It should be used when using custom methods to add Inventar as CSS variables (e.g. as a style in React).
  You can change the key formatting by passing your own `js2CssNameFormatter` function in the options.
* `inject` - A function that inject your Inventar as css variables to a provided DOM element. You can use your own custom injector by passing it in the options as `cssVarsInjector`.

You can replace these with a custom output to generate other formats (e.g. various configuration files), by providing an `outputs` option, which is an object of `InventarOutputFunction`s and `InventarOutputConfig`s.

An `InventarOutputFunction` is a function that receives a processed Inventar and an `InventarOptions` object, and returns any other value. For example, this output function returns a stringified JSON:

```typescript
const jsonOutput = (inventar: Inventar, options: InventarOptions) => JSON.stringify(inventar)
...
const { jsonInventar } = makeInventar({ ... }, { outputs: { jsonInventar: jsonOutput } })
```

As this completely overrides the default, you can import default output and use them in addition to your custom one:

```typescript
import {
	defaultToCssInventarOutput, // cssInventar output
	defaultJsInventarOutput, // jsInventar output
	defaultToInjectOutput, // inject function output
	makeInventar,
} from 'inventar'

...

const { inject, jsonInventar } = makeInventar(
  { ... },
  { outputs: {
   	inject: defaultToInjectOutput,
   	json: jsonOutput,
  } }
)
```

You can also use custom outputs to provide output-specific transformers. These are the same transformers you'd use everywhere else, but they'll only be run on the specific output:

```typescript
import {
	defaultToCssInventarOutput, // cssInventar output
	defaultJsInventarOutput, // jsInventar output
	makeInventar,
} from 'inventar'

const { jsInventar, cssInventar } = makeInventar(
  { ... },
	{ outputs: {
   	jsInventar: defaultJsInventarOutput,
   	cssInventar: { outputFunction: defaultToCssInventarOutput, transformers: [formatColorsToRgba] }
  } }
)
```



## Contribute

Inventar is in a very early stage, and might be subject to major changes.
I'll be happy for any feedback and ideas at inventar.feedback(at)foge.us.
The repository will become public soon, and then you could open issues and contribute.
