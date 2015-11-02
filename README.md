# Node security shrinkwrap audit

This step will install/run the [nsp](https://github.com/nodesecurity/nsp) 
command, which will be used to check your npm-shrinkwrap.json and node_modules
for vulnerabilities.

# Requirements

- Node.js
- npm
- shrinkwrap

# Example

This example will run the step using the default settings: 

```
build:
    steps:
        - shrinkwrap-security-audit
```

# What's new

- switch to nsp command/module

# TODO

TODO

# License

The MIT License (MIT)

# Changelog

## 2.0.0
- switch to nsp

## 1.0.0

- Initial release.
