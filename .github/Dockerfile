# pull official base image
FROM node:23.3.0-alpine

# add file to app folder
ADD . /app/

# change workdir
WORKDIR /app

# install app
RUN --mount=type=secret,id=VITE_FIWARE_SERVER_BASE_URL \
    --mount=type=secret,id=VITE_TENANT_API_SERVER_BASE_URL \
    --mount=type=secret,id=VITE_TENANT_API_USERNAME \
    --mount=type=secret,id=VITE_TENANT_API_PASSWORD \
    npm install && npm run build

# expose web port
EXPOSE 3000

# define entrypoint
CMD ["npm", "run", "start"]
