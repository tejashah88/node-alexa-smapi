'use strict';

const mySecrets = process.env.TRAVIS_SECURE_ENV_VARS ? {
  refreshToken: process.env.REFRESH_TOKEN,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
} : require('./secrets.json');

const LOCALE = 'en-US';

module.exports = {
  refreshToken: mySecrets.refreshToken,
  clientId: mySecrets.clientId,
  clientSecret: mySecrets.clientSecret,
  stage: 'development',
  locale: LOCALE,
  locales: [LOCALE],
  reason: 'OTHER',
  message: 'node-alexa-smapi testing',
  endpointRegion: 'Default', // string enum["Default", "NA", "EU", "FE", etc],
  skillRequest: {
    body: require('./request.json')
  },
  simulationContent: 'api',
  intentRequestParams: {
    nextToken: null,
    maxResults: 10,
    sortDirection: 'desc',
    sortField: 'intent.confidence.bin', // Valid values: dialogAct.name, locale, intent.confidence.bin, stage, publicationStatus, intent.name, interactionType, or utteranceText.
    'dialogAct.name': null, // Valid values: Dialog.ElicitSlot, Dialog.ConfirmSlot, or Dialog.ConfirmIntent.
    locale: LOCALE, // Can have multiple values and is not case-sensitive.
    'intent.confidence.bin': 'high',
    'intent.confidence.bin': 'medium', // eslint-disable-line no-dupe-keys
    'intent.confidence.bin': 'low', // eslint-disable-line no-dupe-keys
    stage: 'live',
    stage: 'development', // eslint-disable-line no-dupe-keys
    publicationStatus: 'certification',
    publicationStatus: 'development', // eslint-disable-line no-dupe-keys
    utteranceText: 'api',
    utteranceText: 'a pie', // eslint-disable-line no-dupe-keys
    utteranceText: 'ape', // eslint-disable-line no-dupe-keys
    'intent.name': 'testIntent',
    'intent.name': 'AMAZON.HelpIntent', // eslint-disable-line no-dupe-keys
    'intent.slot.name': null, // eslint-disable-line no-dupe-keys
    interactionType: 'ONE_SHOT',
    interactionType: 'MODAL' // eslint-disable-line no-dupe-keys
  },
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
