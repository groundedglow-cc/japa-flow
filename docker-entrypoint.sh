#!/bin/sh
set -e

# Start nginx (static files + reverse proxy to node)
nginx

# Start the Node.js API server
exec node server.mjs
