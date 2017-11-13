
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
  <a href="https://github.com/feross/standard">
    <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square" alt="standard JS linter" />
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
