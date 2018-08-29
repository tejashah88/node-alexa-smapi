/* eslint-env mocha */
'use strict';

/*
 * This test suite will perform the following actions:
 * - retrieve a valid access_token and store it for all SMAPI invocations
 * - list all vendors and use the first vendor (account) in the list to create a test skill
 * - invoke all SMAPI operations against this test skill
 * - remove the test skill after all SMAPI testing is complete
 * - if a test suite fails, it may be up to you to manually clean up the test skill created during the failed test suite
 */

/*
 * Test suite requirements:
 * - obtaining refreshToken, clientId, and clientSecret
 *   - follow these instructions: https://developer.amazon.com/docs/smapi/ask-cli-command-reference.html#util-command
 *   - run ask util generate-lwa-tokens and copy the value from refresh_token and use it to initialize refreshToken
 * - create and populate test/data/secrets.json with the following information:
 *   - refreshToken
 *   - clientId
 *   - clientSecret
 */

/*
 * Configurable test suite parameters
 */
const LOG_RESPONSES = false;
const MAX_RETRIES = 10;
const RETRY_TIMEOUT = 10000; // in miliseconds
const MOCHA_TIMEOUT = 10000; // in miliseconds

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
chai.config.includeStack = true;

const VERSION_0 = 'v0';
const VERSION_1 = 'v1';
const SUPPORTED_VERSIONS = [VERSION_0, VERSION_1];
const SKILL_READY = {
  v0: 'SUCCESSFUL',
  v1: 'SUCCEEDED'
};
const MODEL_READY = {
  v0: 'SUCCESS',
  v1: 'SUCCEEDED'
};
var testData = require('./data/common');

function sleep() {
  // TODO figure out a cleaner way to add a wait time
  Atomics.wait(new Int32Array(new SharedArrayBuffer(1024)), 0, 0, RETRY_TIMEOUT);
}

SUPPORTED_VERSIONS.forEach(function(TEST_VERSION) {

  describe('Testing with SMAPI ' + TEST_VERSION, function() {
    this.slow(1500);
    this.timeout(MOCHA_TIMEOUT);
    const smapiClient = require('../index')({
      version: TEST_VERSION
    });

    context('-> Token Management', function() {
      describe('-> refresh token', function() {
        var subject;

        beforeEach(function() {
          subject = testData.accessToken = smapiClient.tokens.refresh({
            refreshToken: testData.refreshToken,
            clientId: testData.clientId,
            clientSecret: testData.clientSecret,
          });
        });

        it('responds with access_token and sets token for future SMAPI calls', function() {
          subject = subject.then(function(response) {
            if (LOG_RESPONSES) console.log(JSON.stringify(response, null, ' '));
            testData.accessToken = response.access_token;
            return response;
          });
          return expect(subject).to.eventually.have.property('access_token');
        });
      });
    });

    context('-> Vendor Operations', function() {
      describe('-> Get Vendor List', function() {
        var subject;

        beforeEach(function() {
          subject = smapiClient.vendors.list();
        });

        it('responds with vendors array', function() {
          subject = subject.then(function(response) {
            if (LOG_RESPONSES) console.log(JSON.stringify(response, null, ' '));
            testData.vendorId = response.vendors[0].id;
            return response;
          });
          return expect(subject).to.eventually.have.property('vendors');
        });
      });
    });

    context('-> Skill Operations (except delete)', function() {
      describe('-> Create a skill', function() {
        var subject;

        beforeEach(function() {
          subject = smapiClient.skills.create(testData.vendorId, testData[TEST_VERSION].skillManifest);
        });

        it('responds with skillId', function() {
          subject = subject.then(function(response) {
            if (LOG_RESPONSES) console.log(JSON.stringify(response, null, ' '));
            testData.skillId = response.skillId;
            return response;
          });
          return expect(subject).to.eventually.have.property('skillId');
          return expect(subject).to.eventually.have.property('location');
        });
      });

      describe('-> List skills (first set)', function() {
        var subject;

        beforeEach(function() {
          subject = smapiClient.skills.list(testData.vendorId, 10);
        });

        it('responds with list of skills', function() {
          subject = subject.then(function(response) {
            if (LOG_RESPONSES) console.log(JSON.stringify(response, null, ' '));
            return response;
          });
          return expect(subject).to.eventually.have.property('_links');
          return expect(subject).to.eventually.have.property('isTruncated');
          return expect(subject).to.eventually.have.property('skills');
        });
      });

      describe('-> Get the status of a skill (and wait for changes to finish)', function() {
        var subject;

        beforeEach(function() {
          subject = smapiClient.skills.status(testData.skillId);
        });

        it('responds with skill status', function() {
          this.retries(MAX_RETRIES);
          subject = subject.then(function(response) {
            if (LOG_RESPONSES) console.log(JSON.stringify(response, null, ' '));
            var status;
            if (TEST_VERSION === VERSION_0) status = response.manifest.lastModified.status;
            else if (TEST_VERSION === VERSION_1) status = response.manifest.lastUpdateRequest.status;
            console.log('---> Skill building: ' + status + ' <---');
            if (status !== SKILL_READY[TEST_VERSION]) sleep();
            return response;
          });
          return expect(subject).to.eventually.have.property('manifest');
          if (TEST_VERSION === VERSION_0) return expect(subject.manifest.lastModified).to.eventually.have.property('status', SKILL_READY[TEST_VERSION]);
          else if (TEST_VERSION === VERSION_1) return expect(subject.manifest.lastUpdateRequest).to.eventually.have.property('status', SKILL_READY[TEST_VERSION]);
        });
      });

      describe('-> Get Skill Information', function() {
        var subject;

        beforeEach(function() {
          if (TEST_VERSION === VERSION_0) subject = smapiClient.skills.getManifest(testData.skillId);
          else if (TEST_VERSION === VERSION_1) subject = smapiClient.skills.getManifest(testData.skillId, testData.stage);
        });

        it('responds with skill manifest', function() {
          subject = subject.then(function(response) {
            if (LOG_RESPONSES) console.log(JSON.stringify(response, null, ' '));
            return response;
          });
          if (TEST_VERSION === VERSION_0) return expect(subject).to.eventually.have.property('skillManifest');
          else if (TEST_VERSION === VERSION_1) return expect(subject).to.eventually.have.property('manifest');
        });
      });

      describe('-> Update an existing skill', function() {
        var subject;

        beforeEach(function() {
          if (TEST_VERSION === VERSION_0) subject = smapiClient.skills.update(testData.skillId, testData[TEST_VERSION].skillManifest);
          else if (TEST_VERSION === VERSION_1) subject = smapiClient.skills.update(testData.skillId, testData.stage, testData[TEST_VERSION].skillManifest);
        });

        it('responds with skill manifest', function() {
          subject = subject.then(function(response) {
            if (LOG_RESPONSES) console.log(JSON.stringify(response, null, ' '));
            return response;
          });
          return expect(subject).to.eventually.have.property('location');
          return expect(subject).to.eventually.have.property('etag');
        });
      });

      describe('-> Get the status of a skill (and wait for changes to finish)', function() {
        var subject;

        beforeEach(function() {
          subject = smapiClient.skills.status(testData.skillId);
        });

        it('responds with skill status', function() {
          this.retries(MAX_RETRIES);
          subject = subject.then(function(response) {
            if (LOG_RESPONSES) console.log(JSON.stringify(response, null, ' '));
            var status;
            if (TEST_VERSION === VERSION_0) status = response.manifest.lastModified.status;
            else if (TEST_VERSION === VERSION_1) status = response.manifest.lastUpdateRequest.status;
            console.log('---> Skill building: ' + status + ' <---');
            if (status !== SKILL_READY[TEST_VERSION]) sleep();
            return response;
          });
          return expect(subject).to.eventually.have.property('manifest');
          if (TEST_VERSION === VERSION_0) return expect(subject.manifest.lastModified).to.eventually.have.property('status', SKILL_READY[TEST_VERSION]);
          else if (TEST_VERSION === VERSION_1) return expect(subject.manifest.lastUpdateRequest).to.eventually.have.property('status', SKILL_READY[TEST_VERSION]);
        });
      });
    });

    context('-> Interaction Model Operations', function() {
      describe('-> Update Interaction Model', function() {
        var subject;

        beforeEach(function() {
          if (TEST_VERSION === VERSION_0) subject = smapiClient.interactionModel.update(testData.skillId, testData.locale, testData[TEST_VERSION].interactionModel);
          else if (TEST_VERSION === VERSION_1) subject = smapiClient.interactionModel.update(testData.skillId, testData.stage, testData.locale, testData[TEST_VERSION].interactionModel);
        });

        it('responds with interaction model location', function() {
          subject = subject.then(function(response) {
            if (LOG_RESPONSES) console.log(JSON.stringify(response, null, ' '));
            return response;
          });
          return expect(subject).to.eventually.have.property('location');
          return expect(subject).to.eventually.have.property('etag');
        });
      });

      describe('-> Get the Interaction Model Building Status', function() {
        var subject;

        beforeEach(function() {
          subject = smapiClient.interactionModel.getStatus(testData.skillId, testData.locale);
        });

        it('responds with interaction model status', function() {
          this.retries(MAX_RETRIES);
          subject = subject.then(function(response) {
            if (LOG_RESPONSES) console.log(JSON.stringify(response, null, ' '));
            var status;
            if (TEST_VERSION === VERSION_0) status = response.status;
            else if (TEST_VERSION === VERSION_1) {
              status = response.interactionModel[testData.locale].lastUpdateRequest.status;
              delete response.interactionModel[testData.locale].eTag;
            }
            console.log('---> Model building: ' + status + ' <---');
            if (status !== MODEL_READY[TEST_VERSION]) sleep();
            return response;
          });
          if (TEST_VERSION === VERSION_0) return expect(subject).to.eventually.have.property('status', MODEL_READY[TEST_VERSION]);
          else if (TEST_VERSION === VERSION_1) return expect(subject).to.eventually.become({
            'interactionModel': {
              'en-US': {
                'lastUpdateRequest': {
                  'status': MODEL_READY[TEST_VERSION]
                }
              }
            }
          });
        });
      });

      describe('-> Head Interaction Model', function() {
        var subject;

        beforeEach(function() {
          if (TEST_VERSION === VERSION_0) subject = smapiClient.interactionModel.getEtag(testData.skillId, testData.locale);
          else if (TEST_VERSION === VERSION_1) subject = smapiClient.interactionModel.getEtag(testData.skillId, testData.stage, testData.locale);
        });

        it('responds with etag', function() {
          subject = subject.then(function(response) {
            if (LOG_RESPONSES) console.log(JSON.stringify(response, null, ' '));
            return response;
          });
          return expect(subject).to.eventually.have.property('etag');
        });
      });

      describe('-> Get Interaction Model', function() {
        var subject;

        beforeEach(function() {
          if (TEST_VERSION === VERSION_0) subject = smapiClient.interactionModel.get(testData.skillId, testData.locale);
          else if (TEST_VERSION === VERSION_1) subject = smapiClient.interactionModel.get(testData.skillId, testData.stage, testData.locale);
        });

        it('responds with interaction model for ' + testData.locale, function() {
          subject = subject.then(function(response) {
            if (LOG_RESPONSES) console.log(JSON.stringify(response, null, ' '));
            return response;
          });
          return expect(subject).to.eventually.have.property('interactionModel');
        });
      });
    });

    context.skip('-> Account Linking Operations', function() {
      describe('-> Update Account Linking', function() {
        var subject;

        beforeEach(function() {
          if (TEST_VERSION === VERSION_0) subject = smapiClient.accountLinking.update(testData.skillId, testData[TEST_VERSION].accountLinkingRequest);
          else if (TEST_VERSION === VERSION_1) subject = smapiClient.accountLinking.update(testData.skillId, testData.stage, testData[TEST_VERSION].accountLinkingRequest);
        });

        it('responds with skillId', function() {
          subject = subject.then(function(response) {
            if (LOG_RESPONSES) console.log(JSON.stringify(response, null, ' '));
            return response;
          });
          return expect(subject).to.eventually.have.property('TBD');
        });
      });

      describe('-> Read Account Linking Info', function() {
        var subject;

        beforeEach(function() {
          if (TEST_VERSION === VERSION_0) subject = smapiClient.accountLinking.readInfo(testData.skillId);
          else if (TEST_VERSION === VERSION_1) subject = smapiClient.accountLinking.readInfo(testData.skillId, testData.stage);
        });

        it('responds with skillId', function() {
          subject = subject.then(function(response) {
            if (LOG_RESPONSES) console.log(JSON.stringify(response, null, ' '));
            return response;
          });
          return expect(subject).to.eventually.have.property('TBD');
        });
      });

      if (TEST_VERSION === VERSION_1) describe('-> Delete Account Linking', function() {
        var subject;

        beforeEach(function() {
          subject = smapiClient.accountLinking.update(testData.skillId, testData.stage);
        });

        it('responds with skillId', function() {
          subject = subject.then(function(response) {
            if (LOG_RESPONSES) console.log(JSON.stringify(response, null, ' '));
            return response;
          });
          return expect(subject).to.eventually.be.empty;
        });
      });
    });

    context('-> Skill Operations (delete only)', function() {
      describe('-> Delete a skill', function() {
        var subject;

        beforeEach(function() {
          subject = smapiClient.skills.delete(testData.skillId);
        });

        it('responds with skill manifest', function() {
          subject = subject.then(function(response) {
            if (LOG_RESPONSES) console.log(JSON.stringify(response, null, ' '));
            return response;
          });
          return expect(subject).to.eventually.be.empty;
        });
      });
    });
  });
});
