"use strict";

var parseCommit = require('../');
var exec = require('child_process').exec;
var path = require('path');
var GIT_DIR = process.env.GIT_DIR;

if (!GIT_DIR) {
  var errMsg = 'Git directory mandatory: \n\n';
  errMsg += 'ex: GIT_DIR=../rails/.git node examples/parse-git-output.js';

  throw new Error(errMsg);
}

GIT_DIR = path.resolve(GIT_DIR);
var COUNT = process.env.COUNT || 5;
var cmd = 'git --git-dir=' + GIT_DIR + ' rev-list --header --max-count=';
cmd += COUNT + ' HEAD --';

exec(cmd, function(err, commitData) {
  var lines = commitData.split('\n');
  var i = 0;
  var commit = null;
  var matched = null;
  var line = null;

  while (i < lines.length) {
    line = lines[i];

    if (matched = line.match(/^(\u0000){0,1}([0-9a-fA-F]{40})/)) {
      if (commit) {
        console.log(parseCommit(commit));
      }

      commit = line;
    } else {
      commit += '\n' + line;
    }

    i++;
  }
});
