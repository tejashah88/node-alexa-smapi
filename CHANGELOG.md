## Changelog

### 0.0.3 (Next)

* [#3](https://github.com/tejashah88/node-alexa-smapi/issues/3): Added support for [SMAPI v1](https://developer.amazon.com/docs/smapi/smapi-migration.html) - [@marcelobern](https://github.com/marcelobern).
* [#1](https://github.com/tejashah88/node-alexa-smapi/issues/1): Added unit testing for skill, interaction model, and vendor operations, added Travis CI integration - [@marcelobern](https://github.com/marcelobern).
* Access token can now be automatically retrieved from Login with Amazon and `smapiClient.tokens.refresh()` should be invoked right after `smapiClient` instantiation - [@marcelobern](https://github.com/marcelobern).
* `smapiClient` should now be instantiated using `{version: "v0, or v1 (default)", region: "NA (default), EU, or FE"}` - [@marcelobern](https://github.com/marcelobern).
* POST, HEAD, and PUT requests now also return location and etag headers - [@marcelobern](https://github.com/marcelobern).
