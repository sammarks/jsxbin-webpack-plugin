const JSXBinWebpackPlugin = require('./index')
const webpack = require('webpack')
const path = require('path')
const rimraf = require('rimraf')
const jsxbin = require('jsxbin')
const { expect } = require('chai')
const fs = require('fs')

jest.mock('jsxbin')

const inDir = (pathname) => path.resolve(__dirname, '..', 'fixtures', pathname)

const config = () => ({
  mode: 'development',
  entry: {
    test1: inDir('entry.js'),
    'test2-extendscript': inDir('entry.js'),
    'test3-extendscript': inDir('entry.js')
  },
  output: {
    path: inDir('dist')
  },
  plugins: [
    new JSXBinWebpackPlugin({
      test: /-extendscript\.js$/
    })
  ]
})

afterEach(() => {
  rimraf.sync(inDir('dist'))
})

it('compiles multiple js files without crashing', () => {
  jsxbin.mockImplementation((inputFile, outputFile) => {
    expect(inputFile).to.match(/test[2-3]-extendscript\.js/)
    expect(outputFile).to.match(/test[2-3]-extendscript\.jsxbin/)
    fs.copyFileSync(inputFile, outputFile)
  })
  return new Promise((resolve) => {
    webpack(config(), (err, stats) => {
      if (stats.hasErrors()) {
        console.error(stats.toJson().errors)
      }
      if (stats.hasWarnings()) {
        console.warn(stats.toJson().warnings)
      }
      expect(err).to.equal(null)
      expect(stats.hasErrors()).to.equal(false)
      const entryContents = fs.readFileSync(inDir('dist/test1.js'), 'utf8')
      const test2Contents = fs.readFileSync(inDir('dist/test2-extendscript.jsxbin'), 'utf8')
      const test3Contents = fs.readFileSync(inDir('dist/test3-extendscript.jsxbin'), 'utf8')
      expect(test2Contents).to.equal(entryContents)
      expect(test3Contents).to.equal(entryContents)
      resolve()
    })
  })
})
