#!/usr/bin/env bash

set -euo pipefail
set -x

c-at-e-file-server local --toml fastly.toml --name "polyfill-library" -- "./app/polyfill-libraries/polyfill-library/polyfills/__dist/"