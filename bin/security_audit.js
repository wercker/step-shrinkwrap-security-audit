var colors = require('colors');
var fs = require('fs');
var request = require('request');
var underscore = require('underscore');

var shrinkwrapPath = process.argv[2];

try {
  var fileData = fs.readFileSync(shrinkwrapPath);
} catch(e) {
  console.error('Unable to read shrinkwrap file');
  process.exit(1);
}

try {
  var shrinkwrapData = JSON.parse(fileData);
} catch(e) {
  console.error('Invalid json data in shrinkwrap file');
  process.exit(1);
}

// Api call requires a package.json. A nice extra feature would be to allow
// the step to use a real package.json
var staticPackageJSON = {
  name: 'wercker/step-shrinkwrap-security-audit'
};

var requestOptions = {
  uri: 'https://api.nodesecurity.io/check',
  method: 'POST',
  json: true,
  body: {
    shrinkwrap: shrinkwrapData,
    package: staticPackageJSON
  },
  headers: {
    'Content-type': 'application/json'
  }
};

var post = request(requestOptions, function(err, resp, body) {
  'use strict';
  if (err) {
    console.error('Unable to make request');
    process.exit(33);
  }

  if (!body || !underscore.isArray(body)) {
    console.error('Expecting response to be a json array');
    process.exit(34);
  }

  if (body.length === 0) {
    console.log('No vulnerable modules detected.'.green);
    process.exit(0);
  }

  console.log('\n' + body.length.toString().red.bold + ' vulnerabilities/issues detected: \n'.bold);
  body.forEach(function(vulnerability) {
    console.log('Title:    ' + vulnerability.title);
    console.log('Module:   ' + vulnerability.module);
    console.log('version:  ' + vulnerability.version);
    console.log('Patched:  ' + vulnerability.patched_versions);
    console.log('Path:     ' + vulnerability.path.join(' > '));
    console.log('Advisory: ' + vulnerability.advisory + '\n');
  });
  process.exit(9);
});
