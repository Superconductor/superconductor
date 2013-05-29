#!/usr/bin/env bash

# Script to use python to run a simple, basic webserver suitable for using to test Superconductor.
# Superconductor needs to be loaded from a web server because it uses AJAX requests to fetch data.
# Due to security restrictions in the browser, these requests are not allowed to target local files,
# even if the requesting page is also local.

cd ../examples
python -m SimpleHTTPServer 8888