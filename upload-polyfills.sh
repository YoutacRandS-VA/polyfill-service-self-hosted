#! /usr/bin/env bash

set -eux

cd app/polyfill-libraries/polyfill-library/polyfills/__dist/
fastly kv-store-entry create --profile personal -s "$(fastly kv-store list --profile personal --json |  jq -r '.Data | .[]|select(.Name == "polyfill-library")|.ID')" --dir .
