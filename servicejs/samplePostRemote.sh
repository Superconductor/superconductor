#!/bin/bash

IP="ec2-54-218-69-113.us-west-2.compute.amazonaws.com"

echo "Using IP: " $IP

echo "Running sample service with post body:"

cat samplePost.json

URL="http://"$IP"/compile"
TYPE="Content-Type: application/json"

curl -i -H $TYPE --data @samplePost.json -X POST $URL
