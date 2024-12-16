# pull official base image
FROM node:23.3.0-alpine

# add file to app folder
ADD . /app/

# change workdir
WORKDIR /app

# install app
ARG VITE_FIWARE_SERVER_BASE_URL=localhost
ENV VITE_FIWARE_SERVER_BASE_URL=$VITE_FIWARE_SERVER_BASE_URL
RUN npm install && npm run build

# expose web port
EXPOSE 3000

# define entrypoint
CMD ["npm", "run", "start"]
