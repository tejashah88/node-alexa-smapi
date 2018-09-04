# node-alexa-smapi

[![NPM Version](https://img.shields.io/npm/v/node-alexa-smapi.svg)](https://www.npmjs.com/package/node-alexa-smapi)
[![Build Status](https://travis-ci.org/tejashah88/node-alexa-smapi.svg?branch=master)](https://travis-ci.org/tejashah88/node-alexa-smapi)
[![Coverage Status](https://coveralls.io/repos/github/tejashah88/node-alexa-smapi/badge.svg?branch=master)](https://coveralls.io/github/tejashah88/node-alexa-smapi?branch=master)

A node.js client library for using the Alexa Skill Management API.

# Notice
As of now, the following SMAPI operations in this module are **untested**: skill testing (invocation, simulation), and intent request history. So if there are any problems, please create a new issue or a pull request to fix the issue. Additionally you can help improve this library's stability by adding tests for yet untested SMAPI operations.

## Table Of Contents

* [Documentation](#documentation)
  * [Constructor](#constructor)
  * [Constants](#constants)
	* [Access Tokens](#access-tokens)
  * [Skill Operations](#skill-operations)
  * [Interaction Model Operations](#interaction-model-operations)
  * [Account Linking Operations](#account-linking-operations)
  * [Vendor Operations](#vendor-operations)
	* [Skill Enablement Operations](#skill-enablement-operations)
  * [Skill Certification Operations](#skill-certification-operations)
  * [Skill Testing Operations](#skill-testing-operations)
  * [Miscellaneous Functions](#miscellaneous-functions)
  * [Custom API calls](#custom-api-calls)
* [Examples](#examples)
  * [Using Promises (normal functions)](#using-promises-normal-functions)
  * [Using Promises (arrow functions)](#using-promises-arrow-functions)
  * [Using Async/Await](#using-asyncawait)

## Documentation
Official Documentation: https://developer.amazon.com/docs/smapi/ask-cli-intro.html#smapi-intro

All methods return a promise, which either resolves to the SMAPI data received, or rejects with an error.

### Constructor
```javascript
// Constructor for building the SMAPI REST client.
// params should be in the form: {version: "v0, or v1 (default)", region: "NA (default), EU, or FE"}.
Object alexaSmapi(optional Object params)
```

### Constants
```javascript
// All possible base URLs. By default, the NA url is used.
const BASE_URLS = {
  NA: 'https://api.amazonalexa.com',
  EU: 'https://api.eu.amazonalexa.com',
  FE: 'https://api.fe.amazonalexa.com'
};
```

### Access Tokens
This module includes operation to retrieve a SMAPI compliant (Login with Amazon) access token. Immediately after instantiation invoke alexaSmapi.tokens.refresh(params) to seed the (Authorization header) access token for all future operations.
```javascript
// Constructor for building the SMAPI REST client.
// params should be in the form: {version: "v0, or v1 (default)", region: "NA (default), EU, or FE"}.
const alexaSmapi = require('node-alexa-smapi');
var smapiClient = alexaSmapi(optional Object params);
smapiClient.tokens.refresh({
	refreshToken: "MY_REFRESH_TOKEN",
	clientId: "MY_CLIENT_ID",
	clientSecret: "MY_CLIENT_SECRET"
});
```

### Skill Operations
Official Documentation: https://developer.amazon.com/docs/smapi/skill-operations.html

```javascript
// Fetches the skill manifest associated with the skill ID.
Object alexaSmapi.skills.getManifest(String skillId, String stage)

// Creates a new skill associated with the vendor ID.
Object alexaSmapi.skills.create(String vendorId, Object skillManifest)

// Updates a skill's manifest with the specified skill ID.
alexaSmapi.skills.update(String skillId, String stage, Object skillManifest)

// Retrieves the current statuc of the skill
Object alexaSmapi.skills.status(String skillId)

// List the skills for a specified vendorId, which is a mandatory parameter.
// The optional maxResults and nextToken values provide paging for the results.
Object alexaSmapi.skills.list(String vendorId, optional Integer maxResults, optional String nextToken)

// Deletes a skill by its skill ID.
alexaSmapi.skills.delete(String skillId)
```

### Interaction Model Operations
Official Documentation: https://developer.amazon.com/docs/smapi/interaction-model-operations.html

```javascript
// Retrieves the interaction model for a specified skill.
Object alexaSmapi.interactionModel.get(String skillId, String stage, String locale)

// Retrieves the Etag for a specified skill.
String alexaSmapi.interactionModel.getEtag(String skillId, String stage, String locale)

// Updates the interaction model for a specified skill.
Object alexaSmapi.interactionModel.update(String skillId, String stage, String locale, Object interactionModel)

// Retrieves the building status of the interaction model.
Object alexaSmapi.interactionModel.getStatus(String skillId, String stage, String locale)
```

### Account Linking Operations
Official Documentation: https://developer.amazon.com/docs/smapi/account-linking-operations.html

```javascript
// Updates the account linking details
alexaSmapi.accountLinking.update(String skillId, String stage, Object accountLinkingRequest)

// Retrieves the account linking details
Object alexaSmapi.accountLinking.readInfo(String skillId, String stage)

// Deletes the account linking details
alexaSmapi.accountLinking.delete(String skillId, String stage)
```

### Vendor Operations
Official Documentation: https://developer.amazon.com/docs/smapi/vendor-operations.html

```javascript
// List all of the vendors associated with a user (access token).
Array alexaSmapi.vendors.list()
```

### Skill Enablement Operations
Official Documentation: https://developer.amazon.com/docs/smapi/skill-enablement.html

```javascript
// Enables a skill stage for the requestor. The requestor should be either a developer or the owner of the skill.
// Please note that only one skill stage can be enabled for a given user at one time.
alexaSmapi.skillEnablement.enable(String skillId, String stage)

// Checks whether a skill stage is enabled or not for the requestor.
alexaSmapi.skillEnablement.status(String skillId, String stage)

// Disables a skill by deleting the skill enablement.
alexaSmapi.skillEnablement.disable(String skillId, String stage)
```

### Skill Certification Operations
Official Documentation: https://developer.amazon.com/docs/smapi/skill-certification-operations.html

```javascript
// Submit a skill for certification for potential publication.
alexaSmapi.skillCertification.submit(String skillId)

// Check status of a skill certification.
// Working for v1 only as it was implemented mainly trough trial & error as operation  is not documented under https://developer.amazon.com/docs/smapi/skill-certification-operations.html
alexaSmapi.skillCertification.status(String vendorId, String skillId)

// Withdraw a skill from the certification process.
// Possible enumeration values for 'reason'
// * TEST_SKILL
// * MORE_FEATURES
// * DISCOVERED_ISSUE
// * NOT_RECEIVED_CERTIFICATION_FEEDBACK
// * NOT_INTEND_TO_PUBLISH
// * OTHER
alexaSmapi.skillCertification.withdraw(String skillId, String reason, String message)
```

### Skill Testing Operations
Official Documentation: https://developer.amazon.com/docs/smapi/skill-testing-operations.html

```javascript
// Used for directly testing a skill by passing the skill request object directly.
Object alexaSmapi.skillTesting.validate(String skillId, String stage, [String] locales)

// Used for directly testing a skill by passing the skill request object directly.
Object alexaSmapi.skillTesting.validationStatus(String skillId, String stage, String validationId)

// Used for directly testing a skill by passing the skill request object directly.
Object alexaSmapi.skillTesting.invoke(String skillId, String endpointRegion, Object skillRequest)

// Simulates a skill execution.
Object alexaSmapi.skillTesting.simulate(String skillId, String content, String locale)

// Retrieves the status of the simulated skill execution.
Object alexaSmapi.skillTesting.simulationStatus(String skillId, String requestId)
```

### Miscellaneous Functions
```javascript
// Refeshes the authorization token with the access token provided.
alexaSmapi.refreshToken(String accessToken)

// Sets the new base URL for future API calls.
alexaSmapi.setBaseUrl(String url)
```

### Custom API calls
Due to its recent release to the public, some API methods may not be covered by this module. In that case, a bunch of custom functions are available to use. They will return the response received from making the call.

```javascript
// Perform a custom HEAD request
alexaSmapi.custom.head(String url)

// Perform a custom GET request
alexaSmapi.custom.get(String url, Object parameters)

// Perform a custom POST request
alexaSmapi.custom.post(String url, Object parameters)

// Perform a custom PUT request
alexaSmapi.custom.put(String url, Object parameters)

// Perform a custom DELETE request
alexaSmapi.custom.delete(String url)
```

## Examples
### Using Promises (normal functions)
```javascript
const smapiClient = require('node-alexa-smapi')()
smapiClient.skills.getManifest(skillId, 'development')
  .then(function(data) {
    console.log(data)
  })
  .catch(function(error) {
    console.log(error)
  });
```

### Using Promises (arrow functions)
```javascript
const smapiClient = require('node-alexa-smapi')()
smapiClient.skills.getManifest(skillId, 'development')
  .then(data => console.log(data))
  .catch(error => console.log(error));
```

### Using Async/Await
```javascript
const smapiClient = require('node-alexa-smapi')()

(async function() {
  try {
    let manifest = await smapiClient.skills.getManifest(skillId, 'development')
    console.log(manifest);
  } catch (error) {
    console.log(error);
  }
})();
```
