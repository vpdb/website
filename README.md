![vpdb][text-logo]

*A database for Virtual Pinball tables.*

[![Codeship Status](http://img.shields.io/codeship/7a665bd0-b073-0135-06f3-52802c62f0b1.svg?style=flat-square)](https://app.codeship.com/projects/257675)
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=RXJHMzgzZ1hZVURNS1pwWUUybFpxUXdOb1daQTlhTmExWms1K3ptenlocz0tLXp2R1VtMUtOOG1PN0tCZ1lJdmdjQ0E9PQ==--59873cb571ddbb196a9f1979a0c316718c2bc23e)](https://www.browserstack.com/automate/public-build/RXJHMzgzZ1hZVURNS1pwWUUybFpxUXdOb1daQTlhTmExWms1K3ptenlocz0tLXp2R1VtMUtOOG1PN0tCZ1lJdmdjQ0E9PQ==--59873cb571ddbb196a9f1979a0c316718c2bc23e)
[![Dependencies](https://david-dm.org/vpdb/website.svg?style=flat-square)](https://david-dm.org/vpdb/website)

This the code of the website. For the API, check out the [server project](https://github.com/vpdb/server).

## Quick Start

Since the web application is completely decoupled from the server, you can 
easily run it locally and use `api.vpdb.io` as backend.

You're going to need to have [Node.js](https://nodejs.org/) and 
[git](https://git-scm.com/downloads) installed.

1. `git clone https://github.com/vpdb/website vpdb-website`
2. `cd vpdb-website`
3. `npm install`
4. `npm run serve:dev:prod`
5. Open `http://localhost:3333` in browser.

## Stack

The VPDB website uses a somewhat modernized stack of AngularJS using ES6 and 
Webpack. For markup, [pug](https://pugjs.org/api/getting-started.html) is used 
and [Stylus](http://stylus-lang.com/) for the styles.

## Build Modes

Since the the website is separated from the server, you can choose any server 
to run with. Basically, when running the website, there are two factors:

1. Which backend to use
2. How to compile

There are two compilation options, `prod` and `dev`. The only difference is that
`prod` minimizes and tree-shakes the code, resulting in a smaller bundle but 
longer compilation time. It also installs a service worker for pre-caching.

The most common ways to build are:

| npm script        |                                     | Server           | Minify |
|-------------------|-------------------------------------|------------------|--------|
| `serve:dev:local` | Development using local server      | `localhost:3000` | no     |
| `serve:dev:prod`  | Development using production server | `api.vpdb.io`    | no     |
| `serve:test`      | Automated tests                     | `localhost:7357` | yes    |
| `build:prod`      | Build for production site           | `api.vpdb.io`    | yes    |
| `build:analyze`   | Build and show bundle analysis      | *n/a*            | yes    |

All `serve` commands will hot-reload your code while you change files locally. 
You can easily add additional server end-points by creating a new VPDB config 
in the `config` folder and set the `CONFIG` environment variable accordingly.

## Tests

Tests are end-to-end using [Protractor](http://www.protractortest.org) through 
[Codeship](https://codeship.com/) and [BrowserStack](https://www.browserstack.com).
Test results of the latest CI run can be seen [here](https://results.vpdb.io/).
For more info about how tests and CI are set up, check [this](https://github.com/vpdb/website/tree/master/src/test). 

Running locally you'll need four terminals open.

- **Server**: Git clone [vpdb/server](https://github.com/vpdb/server) and install 
  it according to the instructions. Then run it with `npm run serve:protractor`.
- **Website**: This repo. Run `npm run serve:test` to spawn the web server.
- **Selenium**: The Selenium server running the tests. First time: `npm run selenium:init`, 
  then just `npm run selenium`. 
- **Test runner**: Finally, execute the tests with `npm run test:local`

Before tests, code is linted using [ESLint](https://eslint.org/).

## Credits

[![IntelliJ IDEA][idea-image]][idea-url]

Thanks to JetBrains for their awesome IDE and support of the Open Source Community!

<a href="https://www.browserstack.com"><img width="300" src="https://raw.githubusercontent.com/vpdb/website/master/src/test/browserstack-logo.png"></a>

Also huge thanks to BrowserStack for offering free end-to-end testing for this project.

## License

GPLv2, see [LICENSE](LICENSE).

[text-logo]: https://github.com/vpdb/server/raw/master/gfx/text-logo.png
[idea-image]: https://raw.githubusercontent.com/vpdb/backend/master/gfx/logo_IntelliJIDEA.png
[idea-url]: https://www.jetbrains.com/idea/
