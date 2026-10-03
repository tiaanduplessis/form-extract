import { mkdir, writeFile } from 'node:fs/promises'
import { transformAsync } from '@babel/core'
import presetEnv from '@babel/preset-env'
import { rollup } from 'rollup'
import { minify } from 'terser'

const bundle = await rollup({
  input: 'src/index.js',
  plugins: [
    {
      name: 'transpile-es5',
      async transform(code) {
        const result = await transformAsync(code, {
          babelrc: false,
          configFile: false,
          presets: [
            [
              presetEnv,
              {
                targets: { ie: '11' },
                modules: false,
                exclude: ['@babel/plugin-transform-typeof-symbol']
              }
            ]
          ]
        })
        return { code: result.code, map: null }
      }
    }
  ]
})
try {
  await mkdir('dist', { recursive: true })
  for (const [format, filename] of [
    ['es', 'form-extract.es.js'],
    ['umd', 'form-extract.js']
  ]) {
    const { output } = await bundle.generate({ format, name: 'formExtract', generatedCode: 'es5' })
    const { code } = output[0]
    await writeFile(`dist/${filename}`, `${code.trimEnd()}\n`)
    if (format === 'umd') {
      const minified = await minify(
        { [filename]: code },
        {
          ecma: 5,
          sourceMap: { filename: 'form-extract.min.js', url: 'form-extract.min.js.map' }
        }
      )
      await writeFile('dist/form-extract.min.js', `${minified.code}\n`)
      await writeFile('dist/form-extract.min.js.map', `${minified.map}\n`)
    }
  }
} finally {
  await bundle.close()
}
