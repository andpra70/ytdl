#!/bin/bash

export PWD=`pwd`

docker kill ytdl

docker build . -t ytdl

docker run --name ytdl --rm -v $PWD/downloads:/ytdl/downloads -p 3000:3000/tcp ytdl
