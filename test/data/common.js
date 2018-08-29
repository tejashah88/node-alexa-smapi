'use strict';

const mySecrets = require('./secrets.json');

module.exports = {
  refreshToken: mySecrets.refreshToken,
  clientId: mySecrets.clientId,
  clientSecret: mySecrets.clientSecret,
  stage: 'development',
  locale: 'en-US',
  reason: 'TBD',
  message: 'TBD',
  endpointRegion: 'TBD',
  skillRequest: 'TBD',
  simulationContent: 'TBD',
  intentRequestParams: {

  },
  v0: {
    skillManifest: require('./manifest_v0.json').skillManifest,
    interactionModel: require('./interactionModel.json').interactionModel,
    accountLinkingRequest: require('./accountLinkingRequest.json'),
  },
  v1: {
    skillManifest: require('./manifest_v1.json').manifest,
    interactionModel: require('./interactionModel.json').interactionModel,
    accountLinkingRequest: require('./accountLinkingRequest.json'),
  }
};
