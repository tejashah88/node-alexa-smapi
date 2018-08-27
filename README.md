# node-alexa-smapi
A node.js client library for using the Alexa Skill Management API.

# Notice
As of now, this module is **mostly untested**, so if there are any problems, please create a new issue or a pull request to fix the issue. Additionally you can help improve this library's stability by adding tests.

## Table Of Contents

* [Documentation](#documentation)
  * [Constructor](#constructor)
  * [Constants](#constants)
  * [Skill Operations](#skill-operations)
  * [Interaction Model Operations](#interaction-model-operations)
  * [Account Linking Operations](#account-linking-operations)
  * [Vendor Operations](#vendor-operations)
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

All methods return a promise, which either resolves to the data received, or rejects with an error.

### Constructor
```javascript
// Constructor for building the SMAPI REST client. If a base URL isn't specified, the NA url is used.
Object alexaSmapi(String token, optional String baseUrl)
```

### Constants
```javascript
// All possible base URLs. By default, the NA url is used.
String alexaSmapi.BASE_URL_NA = "https://api.amazonalexa.com/v0/"
String alexaSmapi.BASE_URL_EU = "https://api.eu.amazonalexa.com/v0/"
```

### Skill Operations
Official Documentation: https://developer.amazon.com/docs/smapi/skill-operations.html

```javascript
// Fetches the skill manifest associated with the skill ID.
Object alexaSmapi.skills.getManifest(String skillId)

// Creates a new skill associated with the vendor ID.
Object alexaSmapi.skills.create(String vendorId, Object skillManifest)

// Updates a skill's manifest with the specified skill ID.
alexaSmapi.skills.update(String skillId, Object skillManifest)

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
Object alexaSmapi.interactionModel.get(String skillId, String locale)

// Retrieves the Etag for a specified skill.
String alexaSmapi.interactionModel.getEtag(String skillId, String locale)

// Updates the interaction model for a specified skill.
Object alexaSmapi.interactionModel.update(String skillId, String locale, Object interactionModel)

// Retrieves the building status of the interaction model.
Object alexaSmapi.interactionModel.getStatus(String skillId, String locale)
```

### Account Linking Operations
Official Documentation: https://developer.amazon.com/docs/smapi/account-linking-operations.html

```javascript
// Updates the account linking details
alexaSmapi.accountLinking.update(String skillId, Object accountLinkingRequest)

// Retrieves the account linking details
Object alexaSmapi.accountLinking.readInfo(String skillId)
```

### Vendor Operations
Official Documentation: https://developer.amazon.com/docs/smapi/vendor-operations.html

```javascript
// List all of the vendors associated with a user.
Array alexaSmapi.vendors.list(String userToken)
```

### Skill Certification Operations
Official Documentation: https://developer.amazon.com/docs/smapi/skill-certification-operations.html

```javascript
// Submit a skill for certification for potential publication.
alexaSmapi.skillCertification.submit(String skillId)

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
Object alexaSmapi.skillTesting.invoke(String skillId, String endpointRegion, Object skillRequest)

// Simulates a skill execution.
Object alexaSmapi.skillTesting.simulate(String skillId, String content, String locale)

// Retrieves the status of the simulated skill execution.
Object alexaSmapi.skillTesting.simulationStatus(String skillId, String requestId)
```

### Miscellaneous Functions
```javascript
// Refeshes the authorization token.
alexaSmapi.refreshToken(String token)

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
const smapiClient = require('node-alexa-smapi')(authToken)
smapiClient.skills.getManifest(skillId)
  .then(function(data) {
    console.log(data)
  })
  .catch(function(error) {
    console.log(error)
  });
```

### Using Promises (arrow functions)
```javascript
const smapiClient = require('node-alexa-smapi')(authToken)
smapiClient.skills.getManifest(skillId)
  .then(data => console.log(data))
  .catch(error => console.log(error));
```

### Using Async/Await
```javascript
const smapiClient = require('node-alexa-smapi')(authToken)

(async function() {
  try {
    let manifest = await smapiClient.skills.getManifest(skillId)
    console.log(manifest);
  } catch (error) {
    console.log(error);
  }
})();
```
