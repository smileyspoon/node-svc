#!/bin/bash

# pull from 01
scp -r node-user@${NODE_IP_01}:/home/node-user/node-svc-v1/server.js /home/betz4871/repos/node-svc-v1/

#commit
git add . -A
git commit -m "updated server.js"
git push origin 02a

# push to 02 and restart
rsh node-user@${NODE_IP_02} "sudo pkill 'nodejs'"
rsh node-user@${NODE_IP_02} sudo chmod 666 /home/node-user/node-svc-v1/server.js
scp -r server.js node-user@${NODE_IP_02}:/home/node-user/node-svc-v1
rsh node-user@${NODE_IP_02} "sudo nodejs node-svc-v1/server.js &"

