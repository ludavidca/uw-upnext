#!/bin/bash

git add .
git commit -m "Automated commit on $(date +'%Y-%m-%d %H:%M:%S')"
git push origin master
