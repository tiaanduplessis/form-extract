
<h1 align="center">form-extract</h1>
<div align="center">
  <strong>Extract values from a form element into an object</strong>
</div>
<div align="center">
  <a href="https://npmjs.org/package/form-extract">
    <img src="https://img.shields.io/npm/v/form-extract.svg?style=flat-square" alt="npm package version" />
  </a>
  <a href="https://npmjs.org/package/form-extract">
  <img src="https://img.shields.io/npm/dm/form-extract.svg?style=flat-square" alt="npm downloads" />
  </a>
  <a href="https://eslint.org/">
    <img src="https://img.shields.io/badge/lint-eslint-brightgreen.svg?style=flat-square" alt="ESLint" />
  </a>
  <a href="https://github.com/prettier/prettier">
    <img src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square" alt="prettier code formatting" />
  </a>
  <a href="https://travis-ci.org/tiaanduplessis/form-extract">
    <img src="https://img.shields.io/travis/tiaanduplessis/form-extract.svg?style=flat-square" alt="travis ci build status" />
  </a>
  <a href="https://github.com/tiaanduplessis/form-extract/blob/master/LICENSE">
    <img src="https://img.shields.io/npm/l/form-extract.svg?style=flat-square" alt="project license" />
  </a>
  <a href="http://makeapullrequest.com">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="make a pull request" />
  </a>
</div>
<br>
<div align="center">
  <a href="https://github.com/tiaanduplessis/form-extract/watchers">
    <img src="https://img.shields.io/github/watchers/tiaanduplessis/form-extract.svg?style=social" alt="Github Watch Badge" />
  </a>
  <a href="https://github.com/tiaanduplessis/form-extract/stargazers">
    <img src="https://img.shields.io/github/stars/tiaanduplessis/form-extract.svg?style=social" alt="Github Star Badge" />
  </a>
  <a href="https://twitter.com/intent/tweet?text=Check%20out%20form-extract!%20https://github.com/tiaanduplessis/form-extract%20%F0%9F%91%8D">
    <img src="https://img.shields.io/twitter/url/https/github.com/tiaanduplessis/form-extract.svg?style=social" alt="Tweet" />
  </a>
</div>
<br>
<div align="center">
  Built with ❤︎ by <a href="https://github.com/tiaanduplessis">tiaanduplessis</a> and <a href="https://github.com/tiaanduplessis/form-extract/contributors">contributors</a>
</div>

<h2>Table of Contents</h2>
<details>
  <summary>Table of Contents</summary>
  <li><a href="#install">Install</a></li>
  <li><a href="#usage">Usage</a></li>
  <li><a href="#contribute">Contribute</a></li>
  <li><a href="#license">License</a></li>
</details>

## Install

[![Greenkeeper badge](https://badges.greenkeeper.io/tiaanduplessis/form-extract.svg)](https://greenkeeper.io/)

With package manager:

```sh
$ npm install form-extract
# OR
$ yarn add form-extract
```

With CDN:

```html
<script src="https://cdn.rawgit.com/tiaanduplessis/form-extract/master/dist/form-extract.min.js"></script>
<!-- Or -->
<script src="https://unpkg.com/form-extract/dist/form-extract.min.js"></script>
```

## Usage

Say you have a `HTML` form:

```html
<form class="foo">
  <input name="name" value="Tiaan">
  <input name="surname" value="du Plessis">
  <input name="country" value="South Africa">
  <input name="city" value="Cape Town">
  <input name="gender" type="radio" value="m" checked>
  <input name="gender" type="radio" value="f">
  <input name="languages" type="checkbox" value="javascript" checked>
  <input name="languages" type="checkbox" value="scala">
  <input name="languages" type="checkbox" value="go" checked>
  <input type="submit" value="Submit">
</form>
```

This can then be extracted to a object:

```js
import formExtract from 'form-extract'

formExtract('.foo') // formExtract(document.querySelector('.foo')) also works
// {
//   city: "Cape Town",
//   country: "South Africa",
//   gender: "m",
//   languages: ["javascript", "go"],
//   name: "Tiaan",
//   surname: "du Plessis"
// }

```

## Development

Use Node 22.22.2+ or Node 24.15.0+ and npm. The development dependency versions
are pinned in `package.json` and `package-lock.json`:

```sh
npm ci --ignore-scripts
npm run check
```

`check` runs lint, formatting checks, the build, and DOM characterization tests.
The tests use jsdom and Node's built-in test runner against the source, CommonJS,
ES module, browser UMD, minified UMD, and AMD entries. Test and lint commands do
not rewrite source files; `npm run format` and `npm run lint:fix` are explicit
write commands. The original runtime source is kept in its existing style.

The build keeps the existing `dist/form-extract.js`, `dist/form-extract.es.js`,
`dist/form-extract.min.js`, and source-map paths. Rollup bundles the source, Babel
preserves the existing ES5 syntax target, and Terser minifies the browser bundle.
As before, browser APIs such as `Array.from` are not polyfilled. Development's
Node requirement does not change the package's browser API.

To test an unpacked npm tarball using the same DOM suite:

```sh
FORM_EXTRACT_PACKAGE=/absolute/path/to/unpacked/package npm test
```

### Extraction behavior covered by the tests

A single field value is returned as a string. Repeated field names produce an
array in DOM order, retaining every value, including empty strings. Only checked
checkboxes and radio buttons contribute values; unchecked controls and submit
inputs are skipped before grouping.

The result is a plain object. Field names such as `__proto__`, `constructor`,
`toString`, and `hasOwnProperty` are stored as own enumerable data properties,
just like other names, without changing the result's prototype. Repeated values
for these names follow the same array behavior.

Unnamed contenteditable elements still use the original `unamed` fallback;
missing selectors throw `TypeError`, and malformed selectors throw the DOM's
`SyntaxError`.

The existing `release` command commits, tags, pushes tags, and publishes to npm.
It is a manual release operation, not a validation command. Its legacy
`prepublish` hook is not a build-on-publish hook in current npm; run
`npm run check` before any separately authorized release to avoid stale bundles.
The release scripts are intentionally unchanged by this tooling refresh.

## Contributing

Contributions are welcome!

1. Fork it.
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

Or open up [a issue](https://github.com/tiaanduplessis/form-extract/issues).

## License

Licensed under the MIT License.
