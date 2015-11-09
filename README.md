# Node security shrinkwrap audit

This step will send the shrinkwrap file to nodesecurity.io. If any vulnerable modules are found, than this step will fail.

# Requirements

- Node.js

# Example

This example will run the step using the default settings:

```
build:
    steps:
        - shrinkwrap-security-audit
```

It is also possible to use a different shrinkwrap path:

```
build:
    steps:
        - shrinkwrap-security-audit:
        	shrinkwrap-path: src/npm-shrinkwrap.json
```

It is also possible to ignore advisories for modules:

```
build:
    steps:
        - shrinkwrap-security-audit:
            ignore: >
                qs=https://nodesecurity.io/advisories/28,
                qs=https://nodesecurity.io/advisories/29
```

# What's new

Switched api call to api.nodesecurity.io. Output has also been improved showing the path of the module  that has the vulnerability. Example output:

``` text
2 vulnerabilities/issues detected:

Title:    Denial-of-Service Extended Event Loop Blocking
Module:   qs
version:  0.6.6
Patched:  >= 1.x
Path:     request > qs
Advisory: https://nodesecurity.io/advisories/28

Title:    Denial-of-Service Memory Exhaustion
Module:   qs
version:  0.6.6
Patched:  >= 1.x
Path:     request > qs
Advisory: https://nodesecurity.io/advisories/29
```

# Options

- `shrinkwrap-path` (optional) The path to the shrinkwrap file. Defaults to `./npm-shrinkwrap.json`.
- `ignore` (optional) Comma separated list of advisories to ignore. The list is formatted as: moduleA=advisoryURL, moduleB=advisoryURL

# TODO

TODO

# License

The MIT License (MIT)

# Changelog

## 2.0.0
- add `ignore` support

## 1.1.0

- update api call to api.nodescurity.io

## 1.0.0

- Initial release.
