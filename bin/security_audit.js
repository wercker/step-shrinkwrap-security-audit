var fs = require('fs');
var request = require('request');

var shrinkwrapPath = process.argv[2];
var shrinkwrapStream = fs.createReadStream(shrinkwrapPath);

var requestOptions = {
    'uri': 'https://nodesecurity.io/validate/shrinkwrap',
    'method': 'POST',
    'json': true,
    'headers': {
        'Content-type': 'application/json'
    }
};

var post = request(requestOptions, function(err, resp, body) {
    'use strict';
    if (err) {
        console.error('Unable to make request');
        process.exit(33);
    }

    if (!body || !body.length) {
        console.error('Expecting response to be a json array');
        process.exit(34);
    }

    if (body.length === 0) {
        console.log('No vulnerable modules detected.');
        process.exit(0);
    }
    else {
        console.log('Vulnerable modules detected:');
        body.forEach(function(vulnerability) {
            console.log('Module ' + vulnerability.module + '@' + vulnerability.version + ' has a vulnerability (more information: https://nodesecurity.io/advisories/' + vulnerability.advisory.url + ')')
        });
        process.exit(9);
    }
});

shrinkwrapStream.pipe(post);