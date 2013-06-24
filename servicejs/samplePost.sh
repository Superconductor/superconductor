#!/bin/bash

echo "Running sample service with post body:"

cat samplePost.json

URL="http://localhost:8080/compile"
TYPE="Content-Type: application/json"

curl -i -H $TYPE --data @samplePost.json -X POST $URL
