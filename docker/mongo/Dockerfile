FROM mongo:latest

MAINTAINER Ariel Schiavoni <arielschiavoni@gmail.com>

RUN rm -rf /etc/mongodb

COPY ./etc /etc/mongodb

VOLUME ["/data", "/var/log/mongodb"]

# Define default command.
CMD ["mongod", "--config", "/etc/mongodb/mongodb.yml"]

EXPOSE 27017
EXPOSE 28017
