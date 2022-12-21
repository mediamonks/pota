#!/bin/sh

echo "After starting, try http://localhost:9003/component-templates/atoms/toggle-expand?isExpanded=false"

node ../../bin/twig-server.js -d ../templates -e ../extensions/twig-extensions.cjs

