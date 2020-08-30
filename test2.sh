#!/bin/bash

curl -X POST -H "Content-Type: application/json"  -d '{"username":"abc" }' ${NODE_IP_01}:3000/1 

