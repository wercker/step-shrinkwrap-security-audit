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

try {
  var ignore = parseIgnores(process.argv[3]);
} catch(e) {
  console.error("Invalid ignore list specified. Should be formatted like:")
  console.error('requesthttps://nodesecurity.io/advisories/28,requesthttps://nodesecurity.io/advisories/29');
}

function parseIgnores(toIgnore) {
  var ignore = {};

  if (!toIgnore) {
    return ignore;
  }

  var items = toIgnore.split(',');
  underscore.each(items, function(item) {
    var values = item.split("=");
    var module = values[0].trim();
    var advisory = values[1].trim();

    if (!ignore[module]) {
      ignore[module] = [];
    }
    ignore[module].push(advisory);
  });

  return ignore;
}

if (Object.keys(ignore).length) {
  console.log('\nIngoring:'.bold)
  var keys = Object.keys(ignore);
  underscore.each(keys, function(key) {
    console.log(' - module: ' + key);
    underscore.each(ignore[key], function(url) {
      console.log('   - ' + url);
    });
  });
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

  var ignored = 0;

  body.forEach(function(vulnerability) {
    var name = vulnerability.module;
    var advisory = vulnerability.advisory;

    var extra = '';
    if (ignore[name] && ignore[name].indexOf(advisory) !== -1) {
      ignored ++;
      extra = '(ingored)'.yellow;
    }
    console.log('Title:    ' + vulnerability.title + ' ' + extra);
    console.log('Module:   ' + name);
    console.log('version:  ' + vulnerability.version);
    console.log('Patched:  ' + vulnerability.patched_versions);
    console.log('Path:     ' + vulnerability.path.join(' > '));
    console.log('Advisory: ' + advisory + '\n');
  });

  if (ignored === body.length) {
    console.log('Skipped all found vulnerabilities'.yellow);
    process.exit(0);
  } else {
    if (ignored) {
      console.log('Ignored ' + ignored.toString().yellow  + ' vulnerabilities.');
    }
  }
  process.exit(9);
});
