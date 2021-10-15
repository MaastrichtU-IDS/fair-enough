# Server for GraphQL with OpenAPI from ElasticSearch

This ExpressJS server serves:

* SearchKit Apollo GraphQL endpoint serving data from an existing ElasticSearch on `/graphql`
* Sofa API to publish an OpenAPI based on the GraphQL endpoint
  * API on `/api`
  * Swagger UI on `/apidocs`
* A React website to search the data on the base URL (`/`) defined in the folder `searchkit-react`

## Development

Install

```bash
yarn
cd searchkit-react
yarn
cd ..
```

Start only the express server on http://localhost:4000

```bash
yarn dev
```

Start the express server on http://localhost:4000 and the React app on http://localhost:3000 (in development mode)

```bash
yarn start
```

## Production

The react website is built first, the bundle is placed in the server `public` folder, and the React app is served from this folder in production on http://localhost:4000

```bash
yarn build
yarn serve
```

## Deploy with Docker

Build:

```bash
docker build -t ghcr.io/bio2kg/registry-server .
```

Run:

```bash
docker run -it -p 4000:4000 ghcr.io/bio2kg/registry-server
```

