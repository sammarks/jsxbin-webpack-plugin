const ModuleFilenameHelpers = require('webpack/lib/ModuleFilenameHelpers')
const jsxbin = require('jsxbin')
const os = require('os')
const path = require('path')
const fs = require('fs')

class JSXBinWebpackPlugin {
  constructor (options) {
    if (typeof options !== 'object') {
      throw new TypeError('Argument "options" must be an object.')
    }
    this.test = options.test
  }

  async _compileFile (compilation, fileName) {
    const jsxFilename = fileName.replace('.js', '.jsxbin')
    const temporaryJSDestination = path.join(os.tmpdir(), fileName)
    const temporaryJSXDestination = path.join(os.tmpdir(), jsxFilename)
    if (fs.existsSync(temporaryJSDestination)) {
      fs.unlinkSync(temporaryJSDestination)
    }
    if (fs.existsSync(temporaryJSXDestination)) {
      fs.unlinkSync(temporaryJSXDestination)
    }
    fs.writeFileSync(temporaryJSDestination, compilation.assets[fileName].source())
    await jsxbin(temporaryJSDestination, temporaryJSXDestination)
    const jsxContents = fs.readFileSync(temporaryJSXDestination, 'utf8')
    fs.unlinkSync(temporaryJSXDestination)
    compilation.assets[jsxFilename] = {
      source: () => jsxContents,
      size: () => jsxContents.length
    }
    delete compilation.assets[fileName]
  }

  async _compileChunks (compilation, chunks) {
    const promises = []
    chunks.forEach((chunk) => {
      chunk.files.forEach((fileName) => {
        if (ModuleFilenameHelpers.matchObject({ test: this.test }, fileName)) {
          promises.push(this._compileFile(compilation, fileName))
        }
      })
    })

    return Promise.all(promises)
  }

  apply (compiler) {
    compiler.plugin('compilation', (compilation) => {
      compilation.plugin('optimize-chunk-assets', (chunks, done) => {
        this._compileChunks(compilation, chunks).then(() => {
          done()
        })
      })
    })
  }
}

module.exports = JSXBinWebpackPlugin
