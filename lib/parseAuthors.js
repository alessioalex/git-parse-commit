"use strict";

var parseHuman = require('git-parse-human2');

function parseAuthors(line, info) {
  if (line.indexOf('author') !== -1) {
    if (info.author = parseHuman(line.replace('author ', ''))) {
      return true;
    }
  }
  if (line.indexOf('committer') !== -1) {
    if (info.committer = parseHuman(line.replace('committer ', ''))) {
      return true;
    }
  }

  return false;
}

module.exports = parseAuthors;
