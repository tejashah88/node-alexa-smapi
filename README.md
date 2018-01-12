# node-alexa-smapi
A node.js client library for using the Alexa Skill Management API.

# Notice
As of now, this module is **mostly untested**, so there are any problems, please create a new issue or a pull request to fix the issue.

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
Object alexaSMAPI(String token, optional String baseUrl)
```

### Constants
```javascript
// All possible base URLs. By default, the NA url is used.
String alexaSMAPI.BASE_URL_NA = "https://api.amazonalexa.com/v0/"
String alexaSMAPI.BASE_URL_EU = "https://api.eu.amazonalexa.com/v0/"
```

### Skill Operations
Official Documentation: https://developer.amazon.com/docs/smapi/skill-operations.html

```javascript
// Fetches the skill manifest associated with the skill ID.
Promise<Object> alexaSMAPI.skills.getManifest(String skillId)

// Creates a new skill associated with the vendor ID.
Promise<Object> alexaSMAPI.skills.create(String vendorId, Object skillManifest)

// Updates a skill's manifest with the specified skill ID.
Promise<Void> alexaSMAPI.skills.update(String skillId, Object skillManifest)

// Retrieves the current statuc of the skill
Promise<Object> alexaSMAPI.skills.status(String skillId)

// List the skills for a specified vendorId, which is a mandatory parameter.
// The optional maxResults and nextToken values provide paging for the results.
Promise<Object> alexaSMAPI.skills.list(String vendorId, optional Integer maxResults, optional String nextToken)

// Deletes a skill by its skill ID.
Promise<Void> alexaSMAPI.skills.delete(String skillId)
```

### Interaction Model Operations
Official Documentation: https://developer.amazon.com/docs/smapi/interaction-model-operations.html

```javascript
// Retrieves the interaction model for a specified skill.
Promise<Object> alexaSMAPI.interactionModel.get(String skillId, String locale)

// Retrieves the Etag for a specified skill.
Promise<String> alexaSMAPI.interactionModel.getEtag(String skillId, String locale)

// Updates the interaction model for a specified skill.
Promise<Object> alexaSMAPI.interactionModel.update(String skillId, String locale, Object interactionModel)

// Retrieves the building status of the interaction model.
Promise<Object> alexaSMAPI.interactionModel.getStatus(String skillId, String locale)
```

### Account Linking Operations
Official Documentation: https://developer.amazon.com/docs/smapi/account-linking-operations.html

```javascript
// Updates the account linking details
Promise<Void> alexaSMAPI.accountLinking.update(String skillId, Object accountLinkingRequest)

// Retrieves the account linking details
Promise<Object> alexaSMAPI.accountLinking.readInfo(String skillId)
```

### Vendor Operations
Official Documentation: https://developer.amazon.com/docs/smapi/vendor-operations.html

```javascript
// List all of the vendors associated with a user.
Promise<Array> alexaSMAPI.vendors.list(String userToken)
```

### Skill Certification Operations
Official Documentation: https://developer.amazon.com/docs/smapi/skill-certification-operations.html

```javascript
// Submit a skill for certification for potential publication.
Promise<Void> alexaSMAPI.skillCertification.submit(String skillId)

// Withdraw a skill from the certification process.
// Possible enumeration values for 'reason'
// * TEST_SKILL
// * MORE_FEATURES
// * DISCOVERED_ISSUE
// * NOT_RECEIVED_CERTIFICATION_FEEDBACK
// * NOT_INTEND_TO_PUBLISH
// * OTHER
Promise<Void> alexaSMAPI.skillCertification.withdraw(String skillId, String reason, String message)
```

### Skill Testing Operations
Official Documentation: https://developer.amazon.com/docs/smapi/skill-testing-operations.html

```javascript
// Used for directly testing a skill by passing the skill request object directly.
Promise<Object> alexaSMAPI.skillTesting.invoke(String skillId, String endpointRegion, Object skillRequest)

// Simulates a skill execution.
Promise<Object> alexaSMAPI.skillTesting.simulate(String skillId, String content, String locale)

// Retrieves the status of the simulated skill execution.
Promise<Object> alexaSMAPI.skillTesting.simulationStatus(String skillId, String requestId)
```

### Miscellaneous Functions
```javascript
// Refeshes the authorization token.
Void alexaSMAPI.refreshToken(String token)

// Sets the new base URL for future API calls.
Void alexaSMAPI.setBaseUrl(String url)
```

### Custom API calls
Due to its recent release to the public, some API methods may not be covered by this module. In that case, a bunch of custom functions are available to use.

```javascript
// Perform a custom HEAD request
Promise<Any> alexaSMAPI.custom.head(String url)

// Perform a custom GET request
Promise<Any> alexaSMAPI.custom.get(String url, Object parameters)

// Perform a custom POST request
Promise<Any> alexaSMAPI.custom.post(String url, Object parameters)

// Perform a custom PUT request
Promise<Any> alexaSMAPI.custom.put(String url, Object parameters)

// Perform a custom DELETE request
Promise<Any> alexaSMAPI.custom.delete(String url)
```

## Examples
### Using Promises (normal functions)
```javascript
var smapiClient = require('node-alexa-smapi')(authToken)
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
var smapiClient = require('node-alexa-smapi')(authToken)
smapiClient.skills.getManifest(skillId)
  .then(data => console.log(data))
  .catch(error => console.log(error));
```

### Using Async/Await
```javascript
var smapiClient = require('node-alexa-smapi')(authToken)

(async function() {
  try {
    var manifest = await smapiClient.skills.getManifest(skillId)
    console.log(manifest);
  } catch (error) {
    console.log(error);
  }
})();
```