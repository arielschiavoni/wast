FROM node:0.10.46

RUN npm install -g node-inspector

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# app port
EXPOSE 3000
# node-inspector port
EXPOSE 8080
CMD [ "npm", "start" ]
