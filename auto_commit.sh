#!/bin/bash

git config user.name "madhavmalik"
git config user.email "madhavmalik25@gmail.com"

git add .
git commit -m "Automated commit on $(date +'%Y-%m-%d %H:%M:%S')"
git push origin master
