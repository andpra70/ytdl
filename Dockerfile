FROM alpine:3.7

LABEL maintainer "andpra70@gmail.com"


RUN apk --no-cache add python3 ffmpeg && \
    pip3 install --no-cache-dir youtube-dl flask

RUN apk update && \
    apk add nodejs

RUN apk add tree

RUN node -v

RUN npm -v

COPY . /ytdl/.

WORKDIR /ytdl/.

RUN ls -al 


EXPOSE 3000

USER 1000

CMD ["node", "index.js"]