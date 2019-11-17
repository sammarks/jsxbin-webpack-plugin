const ModuleFilenameHelpers = require('webpack/lib/ModuleFilenameHelpers')
const os = require('os')
const path = require('path')
const fs = require('fs')
const { RawSource } = require('webpack-sources')

class JSXBinWebpackPlugin {
  constructor (options) {
    if (typeof options !== 'object') {
      throw new TypeError('Argument "options" must be an object.')
    }
    this.test = options.test
    try {
      this.jsxbin = require('jsxbin')
    } catch (err) {
      console.warn('jsxbin package not found. Not compiling jsx assets.')
      this.jsxbin = null
    }
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
    await this.jsxbin(temporaryJSDestination, temporaryJSXDestination)
    const jsxContents = fs.readFileSync(temporaryJSXDestination, 'utf8')
    fs.unlinkSync(temporaryJSXDestination)
    compilation.assets[jsxFilename] = new RawSource(jsxContents)
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
    if (this.jsxbin) {
      const plugin = { name: this.constructor.name }
      compiler.hooks.compilation.tap(plugin, (compilation) => {
        compilation.hooks.optimizeChunkAssets.tapAsync(plugin, (chunks, done) => {
          this._compileChunks(compilation, chunks).then(() => {
            done()
          })
        })
      })
    }
  }
}

module.exports = JSXBinWebpackPlugin
