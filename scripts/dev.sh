#!/usr/bin/env sh

node-inspector --no-preload &

# default to --debug flag if NODE_DEBUG_MODE is not defined
test -z $NODE_DEBUG_MODE && NODE_DEBUG_MODE=--debug

`npm bin`/nodemon \
  --watch src/server \
  --ext js \
  --exec node $NODE_DEBUG_MODE src/server/index.js
