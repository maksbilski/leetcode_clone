#!/bin/sh

# NodeJS installation
curl -SLO https://deb.nodesource.com/nsolid_setup_deb.sh
chmod 500 nsolid_setup_deb.sh
./nsolid_setup_deb.sh 20
apt-get install nodejs -y

sudo apt install npm

npm install
npm start
