#!/bin/bash

export PWD=`pwd`

docker kill ytdl

docker build . -t ytdl

docker tag ytdl andpra70/ytdl

docker login andpra70
docker push andpra70/ytdl

#docker run --name ytdl --rm -v $PWD/downloads:/ytdl/downloads -p 3000:3000/tcp ytdl
docker run --name ytdl --rm -v $PWD/downloads:/ytdl/downloads -p 3000:3000/tcp andpra70/ytdl
