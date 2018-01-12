'use strict';

var axios = require('axios');

const BASE_URL_NA = 'https://api.amazonalexa.com/v0/';
const BASE_URL_EU = 'https://api.eu.amazonalexa.com/v0/';
const BASE_URL_DEFAULT = BASE_URL_NA;

function alexaSMAPI(token, baseUrl) {
  if (typeof token !== 'string' || token.length === 0)
    throw new Error('Invalid token specified!');

  var smapi = { BASE_URL_NA, BASE_URL_EU };

  var rest = {
    client: axios.create({
      baseURL: baseUrl || BASE_URL_DEFAULT,
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }),
    head: function(url) {
      return this.client.head(url)
        .then(response => response.data)
        .catch(response => Promise.reject(response.response));
    },
    get: function(url, parameters) {
      return this.client.get(url, { params: parameters !== undefined ? parameters : {} })
        .then(response => response.data)
        .catch(response => Promise.reject(response.response));
    },
    post: function(url, parameters) {
      return this.client.post(url, parameters !== undefined ? parameters : {})
        .then(response => response.data)
        .catch(response => Promise.reject(response.response));
    },
    put: function(url, parameters) {
      return this.client.put(url, parameters !== undefined ? parameters : {})
        .then(response => response.data)
        .catch(response => Promise.reject(response.response));
    },
    delete: function(url) {
      return this.client.delete(url)
        .then(response => response.data)
        .catch(response => Promise.reject(response.response));
    }
  };

  smapi.refreshToken = (token) => {
    if (typeof token !== 'string' || token.length === 0)
      throw new Error('Invalid token specified!');
    else
      rest.client.defaults.headers.common['Authorization'] = token;
  }

  smapi.setBaseUrl = (url) => {
    if (typeof url !== 'string' || url.length === 0)
      throw new Error('Invalid base url specified!');
    else
      rest.client.defaults.baseURL = url;
  }

  smapi.skills = {
    getManifest: skillId => rest.get(`/skills/${skillId}`),
    create: (vendorId, skillManifest) => rest.post('/skills', { vendorId, skillManifest }),
    update: (skillId, skillManifest) => rest.put(`/skills/${skillId}`, { skillManifest }),
    status: skillId => rest.get(`/skills/${skillId}/status`),
    list: (vendorId, maxResults, nextToken) => rest.get('/skills', { vendorId, maxResults, nextToken }),
    delete: skillId => rest.delete(`/skills/${skillId}`)
  };

  smapi.interactionModel = {
    get: (skillId, locale) => rest.get(`/skills/${skillId}/interactionModel/locales/${locale}`),
    getEtag: (skillId, locale) => rest.head(`/skills/${skillId}/interactionModel/locales/${locale}`),
    update: (skillId, locale, interactionModel) => rest.post(`/skills/${skillId}/interactionModel/locales/${locale}`, { interactionModel }),
    getStatus: (skillId, locale) => rest.get(`/skills/${skillId}/interactionModel/locales/${locale}/status`),
  };

  smapi.accountLinking = {
    update: (skillId, accountLinkingRequest) => rest.put(`/skills/${skillId}/accountLinkingClient`, { accountLinkingRequest }),
    readInfo: skillId => rest.get(`/skills/${skillId}/accountLinkingClient`),
  };

  smapi.vendors = {
    list: () => rest.get('/vendors')
  };

  smapi.skillCertification = {
    submit: skillId => rest.post(`/skills/${skillId}/submit`),
    withdraw: (skillId, reason, message) => rest.post(`/skills/{skillId}/withdraw`, { reason, message })
  };

  smapi.skillTesting = {
    invoke: (skillId, endpointRegion, skillRequest) => rest.post(`/skills/${skillId}/invocations`, { endpointRegion, skillRequest }),
    simulate: (skillId, content, locale) => rest.post(`skills/${skillId}/simulations`, { input: { content }, device: { locale } }),
    simulationStatus: (skillId, requestId) => rest.get(`skills/${skillId}/simulations/${requestId}`)
  };

  smapi.custom = {
    head: url => rest.head(url),
    get: (url, parameters) => rest.get(url, parameters),
    post: (url, parameters) => rest.post(url, parameters),
    put: (url, parameters) => rest.put(url, parameters),
    delete: url => rest.delete(url)
  };

  return smapi;
}

module.exports = alexaSMAPI;