## Changelog

### 1.1.1 (July/9/2019)

* [#12](https://github.com/tejashah88/node-alexa-smapi/issues/12): Updated dependencies to resolve some moderate DDoS security vulnerabilities. Travis CI integration now working for Node.js version 6 through 12. - [@tejashah88](https://github.com/tejashah88).

### 1.1.0 (Sep/10/2018)

* [#1](https://github.com/tejashah88/node-alexa-smapi/issues/1): Added unit testing for account linking, skill enablement, skill testing (validation only) and node-alexa-smapi custom operations, Travis CI integration now working for Node.js version 6 through 10. Added coveralls.io integration - [@marcelobern](https://github.com/marcelobern).
* Added support for undocumented certification status operation (`alexaSmapi.skillCertification.status()`). Currently working with SMAPI v1 (location returned by SMAPI v0 is not valid/usable) - [@marcelobern](https://github.com/marcelobern).
* HEAD, GET, POST, PUT, and DELETE operations now also return HTTP status - [@marcelobern](https://github.com/marcelobern).

### 1.0.0 (Sep/3/2018)

* [#3](https://github.com/tejashah88/node-alexa-smapi/issues/3): Added support for [SMAPI v1](https://developer.amazon.com/docs/smapi/smapi-migration.html) - [@marcelobern](https://github.com/marcelobern).
* [#1](https://github.com/tejashah88/node-alexa-smapi/issues/1): Added unit testing for skill, interaction model, and vendor operations, added Travis CI integration - [@marcelobern](https://github.com/marcelobern).
* Access token can now be automatically retrieved from Login with Amazon and `smapiClient.tokens.refresh()` should be invoked right after `smapiClient` instantiation - [@marcelobern](https://github.com/marcelobern).
* `smapiClient` should now be instantiated using `{version: "v0, or v1 (default)", region: "NA (default), EU, or FE"}` - [@marcelobern](https://github.com/marcelobern).
* POST, HEAD, and PUT requests now also return location and etag headers - [@marcelobern](https://github.com/marcelobern).
