#!/bin/sh
# Start the yak-js server
cd `dirname $0`
exec node server/yakjs.js
