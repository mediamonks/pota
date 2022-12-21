#!/bin/sh
echo "After starting, try http://localhost:9003/component-templates/atoms/toggle-expand-with-heading?isExpanded=false"

node ../../bin/twig-server.js -d ../templates foundation=../templates/foundation -e ../extensions/twig-extensions.cjs