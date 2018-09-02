'use strict';

const mySecrets = process.env.TRAVIS_SECURE_ENV_VARS ? {
  refreshToken: process.env.REFRESH_TOKEN,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
} : require('./secrets.json');

module.exports = {
  refreshToken: mySecrets.refreshToken,
  clientId: mySecrets.clientId,
  clientSecret: mySecrets.clientSecret,
  stage: 'development',
  locale: 'en-US',
  locales: ['en-US'],
  reason: 'OTHER',
  message: 'node-alexa-smapi testing',
  v0: {
    skillManifest: require('./manifest_v0.json').skillManifest,
    interactionModel: require('./interactionModel.json').interactionModel,
    accountLinkingRequest: require('./accountLinkingRequest.json').accountLinkingRequest,
  },
  v1: {
    skillManifest: require('./manifest_v1.json').manifest,
    interactionModel: require('./interactionModel.json').interactionModel,
    accountLinkingRequest: require('./accountLinkingRequest.json').accountLinkingRequest,
  }
};
