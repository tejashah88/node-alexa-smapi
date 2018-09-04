## Changelog

### 1.1.0 (Next)

* [#1](https://github.com/tejashah88/node-alexa-smapi/issues/1): Added unit testing for account linking, skill enablement, skill testing (validation only) and node-alexa-smapi custom operations, Travis CI integration now working for Nodejs version 6 through 10. Added coveralls.io integration - [@marcelobern](https://github.com/marcelobern).
* Added support for undocumented certification status operation (`alexaSmapi.skillCertification.status()`). Currently working with SMAPI v1 (location returned by SMAPI v0 is not valid/usable) - [@marcelobern](https://github.com/marcelobern).

### 1.0.0 (Sep/3/2018)

* [#3](https://github.com/tejashah88/node-alexa-smapi/issues/3): Added support for [SMAPI v1](https://developer.amazon.com/docs/smapi/smapi-migration.html) - [@marcelobern](https://github.com/marcelobern).
* [#1](https://github.com/tejashah88/node-alexa-smapi/issues/1): Added unit testing for skill, interaction model, and vendor operations, added Travis CI integration - [@marcelobern](https://github.com/marcelobern).
* Access token can now be automatically retrieved from Login with Amazon and `smapiClient.tokens.refresh()` should be invoked right after `smapiClient` instantiation - [@marcelobern](https://github.com/marcelobern).
* `smapiClient` should now be instantiated using `{version: "v0, or v1 (default)", region: "NA (default), EU, or FE"}` - [@marcelobern](https://github.com/marcelobern).
* POST, HEAD, and PUT requests now also return location and etag headers - [@marcelobern](https://github.com/marcelobern).
