"use strict";

var parseAuthors = require('./lib/parseAuthors');

function parseCommit(data) {
  var matched = '';
  var line = '';
  var commit = {
    parents: [],
  };
  data = data.split('\n');

  commit.hash = data.shift().match(/[0-9a-fA-F]{40}/)[0];

  var i = 0;
  var len = data.length;

  // parse commit data
  while (line = data[i].trim()) {
    if (!commit.tree && (matched = line.match(/^tree ([0-9a-fA-F]{40})$/))) {
      commit.tree = matched[1];
    } else if (matched = line.match(/^parent ([0-9a-fA-F]{40})$/)) {
      commit.parents.push(matched[1]);
    } else if (matched = /^\s+git\-svn\-id:\s(.+)$/.exec(line)) {
      var svn = matched[1].split(/[@\s]/);
      commit.svn = {
        repo : svn[0],
        rev : Number(svn[1]),
        uuid : svn[2]
      };
    } else if (/-----BEGIN PGP SIGNATURE-----/.test(line)) {
      i++;
      line = data[i].trim();

      while (!(/-----END PGP SIGNATURE-----/.test(line))) {
        commit.pgp = commit.pgp ? commit.pgp + '\n' : '';
        commit.pgp += line;
        i++;
        line = data[i].trim();
      }
    } else if (!parseAuthors(line, commit) && /^\s+(\S.+)/.exec(line)) {
      // empty line means commit message begins
      break;
    }

    i++;
  }

  // slicing from i + 1 to to remove the \n at the beginning of the commit title
  var commitMessage = data.slice(i + 1).map(function(line) {
    // remove 'git spaces' from the beginning of each line
    return line.replace(/^    /, '').replace(/\r$/, '');
  });

  commit.title = commitMessage[0];
  commit.description = commitMessage.slice(2).join('\n');

  return commit;
}

module.exports = parseCommit;
