## Inventar

A TypeScript/JavaScript Design Language Implementer.



### Wait, isn't this just another CSS/JS/\<insert tech here\> styling library?

Nope. But, [as long as CSS variables are supported](https://caniuse.com/#feat=css-variables), it works alongside all of them.
Inventar doesn't hold selectors, CSS properties or selectors. It holds **values** - colors, numbers, URIs... anything you could put in a CSS variable.

#### This **separation of concerns** has some advantages:
- It's very easy to manage and access your values both from JS, from CSS and from any of their supersets - a truly single source of origin.
- Design guidelines are usually hard to teach and enforce. Separating and naming values from the rest of your styling, and have a single universal source for all of them, could make it easier.
- It's also easier to define design guidelines this way. Work together with designers to create your Inventar config and make it easier to transfer their vision to the product.
- You can focus on well-defined, logically connected definitions. Inventar does that with Derivatives.
- Transformers allow you to split, derive, remove, lint and work with values in ways that modify the tree.
- This seperation allows you to use CSS with Javascript logic. This is very useful for theming and white-labeling, for example, where you could now keep your Stylesheets tidy while easily including design variables from external, dynamic data.



## Getting Started

1. Install Inventar (`npm install inventar`).
2. Run `makeInventar` with your configuration:
    ```javascript
    import makeInventar from 'inventar'
    
    const MY_INVENTAR_CONFIG = {
        mainColor: '#007788',
        mainText: (config) => config.mainColor,
    }
    
    const { jsInventar, cssInventar, inject } = makeInventar(MY_INVENTAR_CONFIG)
    ```
3. To access your variables in JavaScript or TypeScript:
    ```javascript
    jsConfig.mainText // #007788
    ```
4. To add them as CSS variable, inject them to a wrapping object:
    ```javascript
    const appWrapper = document.getElementsByClassName('appWrapper')[0]
    inject(appWrapper)
    ```



## Configuration

A configuration is your definition of the inventar. It is a flat object, whose keys will become variable names, and its values - their values.
A configuration value may be of the following types:

```javascript
const SAMPLE_CONFIG = {
    numberValue: 1, // Number
    stringValue: '#ff0000', // String
    derivativeValue: config => 2 * config.numberValue, // Derivative function
    definitionObjectValue: { value: 3, transformers: [...] }, // Definition object
}
```


### Derivatives

Derivatives are values that are derived, computed, from another value or values. A derivative is a function that accepts the resolved version of your configuration as an argument, so you can access all of your variables.
You can use this to define component/role colors from named colors:

```javascript
{
    mainBright: `#f0f0f0`,
    backgroundColor: config => config.mainBright,
}
```
To create values with relations to other values:
```
{
    gray: '#888',
    brightGray: config => brightenColor(config.gray),
    baseMargin: 5,
    doubleMargin: config => 2 * config.baseMargin,
}
```
And much more.



### Definition Objects

Definition objects allow you to add additional options to your variable. Currently, the only option available is **transformers**, which accepts an array of transformer functions to apply on the value. You can read more about transformers below.
```javascript
{
    gray: {
        value: '#888',
        transformers: [steps(5)],
    }
}
```
Could be resolved to:
```javascript
{
    darkerGray: '#666',
    darkGray: '#777',
    gray: '#888',
    lightGray: '#999',
    lighterGray: '#aaa',
}
```

## Options
All options are optional.

| option              | type                                                       | default               | description                                                  |
| ------------------- | ---------------------------------------------------------- | --------------------- | ------------------------------------------------------------ |
| cssVarsInjector     | (cssVarsConfig:inventarConfig, domEl: HTMLElement) => void | `injectToStyle`       | Overrides the way CSS vars are injected to a DOM element when `inject` is used. Two functions are provided - **`injectToStyle`**, which adds CSS variables as inline styles and allows you to choose which DOM element will be injected, and **`injectToRoot`** which adds them to the document body with `setProperty` and is more backward compatible. You can also write your own. |
| js2CssNameFormatter | (jsName:string) => string                                  | `camelCase2KebabCase` | Formats JS variable names are to css variable names.         |
| preTransformers     | InventarTransformersSequence                               | `[]`                  | A sequence of transformers to be executed on every variable, before its own transformers run. |
| postTransformers    | InventarTransformersSequence                               | `[]`                  | A sequence of transformers to be executed on every variable, after its own transformers run. |
|shouldMakeCssInventar|boolean|`true`|If set to false, running `makeInventar` will **not** create `cssInventar` and `inject`.



## Transformers

Transformers are middleware, plugins, that you can apply on variables to alter, create multiple new variables or remove variables in your configuration.



### Value-Specific Transformers

A value provided as a definition project can include an array of transformers. For example:

```javascript
// Input
{
    gray: {
        value: '#888',
        transformers: [steps(5)],
    }
}
  
// Could be resolved to:
{
    darkerGray: '#666',
    darkGray: '#777',
    gray: '#888',
    lightGray: '#999',
    lighterGray: '#aaa',
}
```


### Global Transformers

You can apply transformers on all of the configuration by passing them as options. Both `preTransformers` and `postTransformers` accept an array of transformers. The execution order is as follows:

```
preTransformers → value-specific transformers → derivative functions -> postTransformers
```



To execute a global transformer on some (but not all) of the variable, you can provide a test function or a regex, like so:

```javascript
postTransformers: [{ transformer: hexToRgba(), test: /[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8}/ }]
```



### Writing Your Own Transformers

Writing a transformer is very simple. A transformer is simply a function that accepts a variable tuple (its name and value), and returns an array of zero or more such tuples.

```javascript
// This is a transformer. It'll replace a given variable with another one that with the value doubled and its name postfixed with "X2":
([name, value]) => [[`${capitalizeFirstLetter(name)}X2`, value * 2]]

// The original variable is not preserved. If we'd like to keep it, we can pass it as another variable:
([name, value]) => [[name, value], [`${capitalizeFirstLetter(name)}X2`, value * 2]]

// To just remove the variable, simply return an empty array. This will remove the variable if its name ends with the word "Debug":
([name, value]) => name.endsWith('Debug') ? [] : [[name, value]]

// If your transformer needs to accept an option, accept them in a higher order function and return the transformer, like so:
const multiplyBy = (by) => ([name, value]) => [[name, value * by]]
...
{
  singleMargin: 3,
  doubleMargin: { value: config => config.singleMargin, transformers: [multiplyBy(2)] }
}
```



## Development

TODO