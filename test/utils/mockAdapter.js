'use strict';

var axios = require('axios');
var MockAdapter = require('axios-mock-adapter');

const responses = require('../data/responses.json');

// This sets the mock adapter on the default instance
var mock = new MockAdapter(axios);

// Token related mocked operations were added manually to avoid exposing sensitive data
mock.onPost('/auth/o2/token', {
  grant_type: 'refresh_token',
  refresh_token: 'bad',
  client_id: 'bad',
  client_secret: 'bad'
}).reply(401);
mock.onPost('/auth/o2/token').reply(200, { access_token: 'dummy' });

for (var response of responses) {
  switch (response.method) {
  case 'get':
    mock.onGet(response.url).reply(response.status, response.data, response.headers);
    break;
  case 'put':
    mock.onPut(response.url).reply(response.status, response.data, response.headers);
    break;
  case 'post':
    mock.onPost(response.url).reply(response.status, response.data, response.headers);
    break;
  case 'head':
    mock.onHead(response.url).reply(response.status, response.data, response.headers);
    break;
  case 'delete':
    mock.onDelete(response.url).reply(response.status, response.data, response.headers);
    break;
  }
}

module.exports = mock;
