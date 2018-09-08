/* eslint-env mocha */
'use strict';

var escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

var utils = {};

utils.sanitize = (content, replacements) => {
  content = JSON.stringify(content, null, ' ');
  for (var replacement in replacements) {
    content = content.replace(new RegExp(escapeRegExp(replacements[replacement]), 'g'), replacement);
  }
  return JSON.parse(content.replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/g, 'TIMESTAMP'));
};

utils.persist = (file, content) => {
  // Persist response template
  const fs = require('fs');
  fs.writeFile(file, JSON.stringify(content, null, ' '), {mode: 0o600}, function(err) {
    if (err) {
      return console.error(err); // eslint-disable-line no-console
    }
    console.log(`File ${file} was updated!`); // eslint-disable-line no-console
    return 0;
  });
};

module.exports = utils;
