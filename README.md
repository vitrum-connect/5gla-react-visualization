# Getting Started with 5GLa Visualization

## Create .env

Rename/copy `.env.example` to `.env` and change the `.env` with your configuration. 

## Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `npm run start`

Runs the app in the production mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Run with Docker

```shell
docker build --secret type=env,id=VITE_FIWARE_SERVER_BASE_URL,env=<url of Fiware server> \
             --secret type=env,id=VITE_TENANT_API_SERVER_BASE_URL,env=<url of tenant API server> \
             --secret type=env,id=VITE_TENANT_API_USERNAME,env=<username for tenant API server> \
             --secret type=env,id=VITE_TENANT_API_PASSWORD,env=<password for tenant API server> \
             -f ./.github/Dockerfile \
             -t 5gla-react-visualization .
docker run --name 5gla-react-visualization -p 3000:3000 5gla-react-visualization
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser. 