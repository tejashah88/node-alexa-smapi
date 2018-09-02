'use strict';

const mySecrets = process.env.REFRESH_TOKEN && process.env.CLIENT_ID && process.env.CLIENT_SECRET ? {
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
