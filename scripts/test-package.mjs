import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

const temp = await mkdtemp(path.join(tmpdir(), 'form-extract-package-'))
const npm = (args) =>
  execFileSync(process.execPath, [process.env.npm_execpath, ...args], {
    encoding: 'utf8',
    env: { ...process.env, npm_config_ignore_scripts: 'true' }
  })
try {
  const [packed] = JSON.parse(
    npm(['pack', '--ignore-scripts', '--json', '--pack-destination', temp])
  )
  assert.deepEqual(packed.files.map((file) => file.path).sort(), [
    'LICENSE',
    'README.md',
    'dist/form-extract.es.js',
    'dist/form-extract.js',
    'dist/form-extract.min.js',
    'dist/form-extract.min.js.map',
    'package.json'
  ])
  const consumer = path.join(temp, 'consumer')
  await mkdir(consumer)
  await writeFile(path.join(consumer, 'package.json'), '{"private":true}')
  npm([
    'install',
    '--prefix',
    consumer,
    '--ignore-scripts',
    '--no-audit',
    '--no-fund',
    path.join(temp, packed.filename)
  ])
  execFileSync(process.execPath, ['--test', 'test/index.test.mjs'], {
    stdio: 'inherit',
    env: { ...process.env, FORM_EXTRACT_PACKAGE: path.join(consumer, 'node_modules/form-extract') }
  })
} finally {
  await rm(temp, { recursive: true, force: true })
}
