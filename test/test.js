"use strict";

var fs = require('fs');
var test = require('tape');
var out = require('./out.json');
var parseCommit = require('../');
var commitData = fs.readFileSync(__dirname + '/../test/fixtures.txt', 'utf8');

test('should parse the commits', function(assert) {
  var commits = [];

  var lines = commitData.split('\n');
  var i = 0;
  var commit = null;
  var matched = null;
  var line = null;

  while (i < lines.length) {
    line = lines[i];

    if (matched = line.match(/^(\u0000){0,1}([0-9a-fA-F]{40})/)) {
      if (commit) {
        commits.push(parseCommit(commit));
      }

      commit = line;
    } else {
      commit += '\n' + line;
    }

    i++;
  }

  assert.deepEqual(commits, out, 'what goes in must come out correctly');
  assert.end();
});
