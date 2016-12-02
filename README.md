# os-apps

[![Travis](https://img.shields.io/travis/vutran/os-apps/develop.svg?maxAge=2592000&style=flat-square)](https://travis-ci.org/vutran/os-apps) [![Coveralls branch](https://img.shields.io/coveralls/vutran/os-apps/develop.svg?maxAge=2592000&style=flat-square)](https://coveralls.io/github/vutran/os-apps) [![license](https://img.shields.io/github/license/vutran/os-apps.svg?maxAge=2592000&style=flat-square)](LICENSE)

> Retrieve apps available on your OS.

## Install

```bash
$ npm install --save os-apps
```

## Usage

```js
const osApps = require('os-apps');

osApps.getAll().then(apps => {
  // array of apps...
  apps.forEach(app => {
    console.log(app);
  });
})
```

## API

### getAll([useType])

Returns a `Promise` with all paths to all apps.

#### useType

Type: `String`

Default: `system`

Options: `user`, `system`

The use type.

### getAppsInDirectory(dir)

Returns a `Promise` with paths to all apps in the given directory.

#### dir

Type: `String`

The directory to read

## License

MIT © [Vu Tran](https://github.com/vutran/)
