# Node security shrinkwrap audit

This step will send the shrinkwrap file to nodesecurity.io. If any vulnerable modules are found, than this step will fail.

# Requirements

- Node.js

# Example

This will run `shrinkwrap-security-audit` using the default shrinkwrap file.

```
build:
    steps:
        - shrinkwrap-security-audit
```

# What's new

- Initial release.

# Options

- `shrinkwrap-path` (optional) The path to the shrinkwrap file. Defaults to `./shrinkwrap`.

# TODO

TODO

# License

The MIT License (MIT)

# Changelog

## 1.0.0

- Initial release.
