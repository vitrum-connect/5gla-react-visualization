# pull official base image
FROM node:23.3.0-alpine

# install web server
RUN npm install -g serve

# add file to app folder
ADD . /app/

# change workdir
WORKDIR /app

# install app
RUN npm install && npm run build

# expose web port
EXPOSE 3000

# define entrypoint
CMD ["serve", "-s", "/app/build"]
