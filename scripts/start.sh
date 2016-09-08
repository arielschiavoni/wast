#!/usr/bin/env sh

if [ "$ENV" = "development" ]; then
  npm run dev
else
  node src/server/index.js
fi
