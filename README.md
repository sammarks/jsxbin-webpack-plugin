![][header-image]

[![CircleCI][circleci-image]][circleci-url]
[![NPM version][npm-version]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
![License][license]
![Issues][issues]

`jsxbin-webpack-plugin` is a Webpack 4.x plugin for compiling ExtendScript into `.jsxbin` files for use in
Adobe CEP extensions. **If you are looking for Webpack 3.x support, use v0.0.4 and older.**

## Get Started

```sh
npm install --save-dev jsxbin-webpack-plugin
```

```js
const JSXBinWebpackPlugin = require('jsxbin-webpack-plugin')

module.exports = {
  entry: {
    'app-extendscript': 'app-extendscript.js'
  },
  output: {
    path: 'dist'
  },
  plugins: [
    new JSXBinWebpackPlugin({
      test: /-extendscript\.js$/
    })
  ]
}
```

## Features

- Uses the [jsxbin][jsxbin-link] package to compile from JS to JSXBin files.
- Includes a `test` option to only compile specific output chunks.

## Why use this?

Instead of using a build tool like `gulp` to take raw ES5 code and package it, I've found it to be a
lot more flexible to use something like Webpack and Babel to first transpile the code, and then compile
it down to the JSXBin format.

Since Webpack and Babel are already involved for transpiling the code, introducing something like `gulp`
or a bash script into the mix would be introducing yet another tool into the build pipeline for my CEP
plugins.

[header-image]: https://raw.githubusercontent.com/sammarks/art/master/jsxbin-webpack-plugin/header.jpg
[circleci-image]: https://img.shields.io/circleci/project/github/sammarks/jsxbin-webpack-plugin.svg
[circleci-url]: https://circleci.com/gh/sammarks/jsxbin-webpack-plugin/tree/master
[npm-version]: https://img.shields.io/npm/v/jsxbin-webpack-plugin.svg
[npm-downloads]: https://img.shields.io/npm/dm/jsxbin-webpack-plugin.svg
[npm-url]: https://www.npmjs.com/package/jsxbin-webpack-plugin
[license]: https://img.shields.io/github/license/sammarks/jsxbin-webpack-plugin.svg
[issues]: https://img.shields.io/github/issues/sammarks/jsxbin-webpack-plugin.svg
[jsxbin-link]: https://github.com/runegan/jsxbin
