FROM nginx:latest

MAINTAINER Ariel Schiavoni <arielschiavoni@gmail.com>

RUN rm -rf /etc/nginx

COPY ./etc /etc/nginx

# Define mountable directories.
VOLUME ["/data", "/var/log/nginx", "/etc/nginx/config"]

# Define working directory.
WORKDIR /data

CMD ["nginx"]
