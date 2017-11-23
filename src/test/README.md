# Tests

This directory contains common resources used in tests. Tests are written in 
Typescript in order to have syntax completion.

In general, tests can be found right beside the code. For every view there are
usually two files:

- The page file (e.g. `app.page.ts`)
- The tests (e.g. `app.spec.ts`).

The page file implements the [Page Object Pattern](https://github.com/SeleniumHQ/selenium/wiki/PageObjects),
while the tests implement the test cases for each feature. The test framework 
used is standard [Protractor](http://www.protractortest.org) with [Jasmine](https://jasmine.github.io/).

## Running Locally

Running locally you'll need four terminals open.

- **Server**: Git clone [vpdb/server](https://github.com/vpdb/server) and install it according to 
  the instructions. Then run it with `npm run serve:protractor`.
- **Webapp**: This repo. Run `npm run serve:test` to spawn the web server.
- **Selenium**: The Selenium server running the tests. First time: `npm run selenium:init`, then just `npm run selenium`. 
- **Test runner**: Finally, execute the tests with `npm run test:local`

## Continuous Integration

On every push to GitHub, tests are executed on multiple browsers. While the 
runner is executed on Codeship, the actual tests are run on BrowserStack.

This works by setting up a test backend on Codeship and running a tunnel client
which basically maps all local ports of the BrowserStack VM to the Codeship VM.
The Codeship test runner then connects to the Webdriver URL of BrowserStack, 
resulting in the tests being hosted and driven by Codeship but executed on 
BrowserStack.


