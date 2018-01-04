#!/usr/bin/env bash

ip="192.168.1.244";
user="webuser";

npm run build:dev;

ssh ${user}@${ip} "mkdir -p /srv/www/callcenter-component";
scp -r dist/* ${user}@${ip}:/srv/www/callcenter-component;
