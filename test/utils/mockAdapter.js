'use strict';

var axios = require('axios');
var MockAdapter = require('axios-mock-adapter');

const responses = require('../data/responses.json');

// This sets the mock adapter on the default instance
var mock = new MockAdapter(axios);

mock.onPost('/auth/o2/token').reply(200, {access_token: 'dummy'});

for (var response of responses) {
  switch (response.method) {
  case 'get':
    mock.onGet(response.url).reply(200, response.data, response.headers);
    break;
  case 'put':
    mock.onPut(response.url).reply(200, response.data, response.headers);
    break;
  case 'post':
    mock.onPost(response.url).reply(200, response.data, response.headers);
    break;
  case 'head':
    mock.onHead(response.url).reply(200, response.data, response.headers);
    break;
  case 'delete':
    mock.onDelete(response.url).reply(200, response.data, response.headers);
    break;
  }
}

module.exports = mock;
