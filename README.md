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

# What's new

- Initial release.

# Options

- `shrinkwrap-path` (optional) The path to the shrinkwrap file. Defaults to `./npm-shrinkwrap.json`.

# TODO

TODO

# License

The MIT License (MIT)

# Changelog

## 1.0.0

- Initial release.
