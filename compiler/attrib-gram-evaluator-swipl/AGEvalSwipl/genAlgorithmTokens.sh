#!/bin/bash
### manually put this into sanitizer.java alongside algorithmFixed.tokens
cat algorithm.pl  | grep ":-" | sed s#:-.*#:-#g | egrep -oh "^[a-zA-Z0-9]+" | sort | uniq > algorithm.tokens 

