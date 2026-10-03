import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import test from 'node:test'
import { JSDOM } from 'jsdom'
import { cases } from './characterization.mjs'

const root = process.env.FORM_EXTRACT_PACKAGE || fileURLToPath(new URL('..', import.meta.url))
const read = (relative) => readFile(path.join(root, relative), 'utf8')
const importCode = async (relative) =>
  (
    await import(
      `data:text/javascript;base64,${Buffer.from(await read(relative)).toString('base64')}`
    )
  ).default
const require = createRequire(import.meta.url)
const pkg = JSON.parse(await read('package.json'))
const loaders = {
  ...(process.env.FORM_EXTRACT_PACKAGE ? {} : { source: () => importCode('src/index.js') }),
  commonjs: () => require(root),
  esm: () => importCode(pkg['jsnext:main']),
  browser: async (window) => {
    window.eval(await read(pkg.browser))
    return window.formExtract
  },
  minified: async (window) => {
    window.eval(await read('dist/form-extract.min.js'))
    return window.formExtract
  },
  amd: async (window) => {
    let exported
    window.define = (factory) => {
      exported = factory()
    }
    window.define.amd = true
    window.eval(await read(pkg.browser))
    return exported
  }
}

for (const [entry, load] of Object.entries(loaders)) {
  for (const [name, check] of cases) {
    test(`${entry}: ${name}`, async () => {
      const dom = new JSDOM('', { runScripts: 'outside-only' })
      const { window } = dom
      const oldDocument = Object.getOwnPropertyDescriptor(globalThis, 'document')
      const oldHTMLElement = Object.getOwnPropertyDescriptor(globalThis, 'HTMLElement')
      globalThis.document = window.document
      globalThis.HTMLElement = window.HTMLElement
      try {
        const extract = await load(window)
        assert.equal(typeof extract, 'function')
        check({ extract, document: window.document })
      } finally {
        if (oldDocument) Object.defineProperty(globalThis, 'document', oldDocument)
        else delete globalThis.document
        if (oldHTMLElement) Object.defineProperty(globalThis, 'HTMLElement', oldHTMLElement)
        else delete globalThis.HTMLElement
        window.close()
      }
    })
  }
}
