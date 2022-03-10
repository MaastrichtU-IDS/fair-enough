# ♻️ FAIR enough 🎯

[![Run backend tests](https://github.com/MaastrichtU-IDS/fair-enough/actions/workflows/test-backend.yml/badge.svg)](https://github.com/MaastrichtU-IDS/fair-enough/actions/workflows/test-backend.yml) [![CodeQL analysis](https://github.com/MaastrichtU-IDS/fair-enough/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/MaastrichtU-IDS/fair-enough/actions/workflows/codeql-analysis.yml)

A service where anyone can run evaluations to assess how compliant to the FAIR principles is a resource, given the resource identifier (URI/URL).

An **evaluation** runs a **collection** of **assessments** against the resource to evaluate.

* **Evaluations** can be created by anyone without authentication. An evaluation takes the URI of the resource to evaluate, and a collection of assessments to run against this resource.
* **Collections** can be created through the API after authenticating with ORCID. A collection is a sorted list of assessments.
* **Assessments** are tests written in Python that can be part of a collection. Each assessment run some tests against the resource to evaluate, record the results, and pass the results to the next assessment in the collection. To create a test you will need to add a python file in the folder `backend/app/assessments` and send us a pull request (see below for more details)

Backend built with [FastAPI](https://fastapi.tiangolo.com/), [Pydantic](https://pydantic-docs.helpmanual.io/), and [MongoDB](https://www.mongodb.com/)

Frontend built with [React](https://reactjs.org) and [Material UI](https://mui.com/)

## 📥️ Requirements

* [Docker](https://www.docker.com/)
* [Docker Compose](https://docs.docker.com/compose/install/)
* [Poetry](https://python-poetry.org/) if you need to install new Python packages.

* [Node.js](https://nodejs.org/en/) (with `npm`) and [`yarn`](https://yarnpkg.com/) if you need to do frontend development

## 🐳 Backend local development

Create a `.env` file with your development settings in the root folder of this repository (you can copy `.env.sample`):

```
ORCID_CLIENT_ID=APP-XXX
ORCID_CLIENT_SECRET=XXXX
FRONTEND_URL=http://localhost:19006
```

Start the stack for development locally with Docker Compose from the root folder of this repository:

```bash
docker-compose up -d
```

If the database is empty you'll need to register the initial Metrics Tests with the init script:

```bash
./init_metrics_tests.sh
```

Now you can open your browser and interact with these URLs:

* Automatic OpenAPI documentation with Swagger UI: http://localhost/docs

* Alternative OpenAPI documentation with ReDoc: http://localhost/redoc
* GraphQL endpoint with Strawberry: http://localhost/graphql

* Backend, JSON based web API based on OpenAPI: http://localhost/api/

* Traefik UI, to see how the routes are being handled by the proxy: http://localhost:8090

* Frontend, built with Docker, with routes handled based on the path: http://localhost

To check the logs of a specific service, run:

```bash
docker-compose logs backend
```

To delete the volume and reset the database, run:

```bash
docker-compose down
docker volume rm fair-enough_mongodb-data
```

You can also run this script to reset the database, and restart the docker-compose:

```bash
./reset_local_db.sh
```

If you need to completely reset the Python cache:

```bash
docker-compose down
sudo rm -rf **/__pycache__
docker-compose build --no-cache
```

### Add new packages

**Without docker:**

By default, the dependencies are managed with [Poetry](https://python-poetry.org/), go there and install it.

From `./backend/` you can install all the dependencies with:

```bash
poetry install
```

To add new dependencies, run:

```bash
poetry add my-package
```

**With docker:**

If you don't have poetry installed locally or are facin issue with it, you can also add new packages with `docker-compose`, while the docker-compose is running run:

> ```bash
>docker-compose exec backend poetry add my-package
> ```

If you install a new package you will need to stop the current docker-compose running, then restarting it to rebuild the docker image:

```bash
docker-compose up --build --force-recreate
```

You can start a shell session with the new environment with:

```bash
poetry shell
```

Next, open your editor at `./backend/` (instead of the project root: `./`), so that you see an `./app/` directory with your code inside. That way, your editor will be able to find all the imports, etc. Make sure your editor uses the environment you just created with Poetry.

During development, you can change Docker Compose settings that will only affect the local development environment, in the file `docker-compose.override.yml`

### Backend tests

#### Test in docker

Make sure the database is reset:

```bash
docker-compose -f docker-compose.test.yml down
```

Run the tests:

```console
docker-compose -f docker-compose.test.yml up
```

#### Test running stack

If your stack is already up and you just want to run the tests, you can use:

```bash
docker-compose exec backend /app/tests-start.sh
```

That `/app/tests-start.sh` script just calls `pytest` after making sure that the rest of the stack is running. If you need to pass extra arguments to `pytest`, you can pass them to that command and they will be forwarded.

For example, to stop on first error:

```bash
docker-compose exec backend bash /app/tests-start.sh -x
```

#### Local tests

Start the stack with this command:

```Bash
DOMAIN=backend sh ./scripts/test-local.sh
```
The `./backend` directory is mounted as a "host volume" inside the docker container (set in the file `docker-compose.dev.volumes.yml`).
You can rerun the test on live code:

```Bash
docker-compose exec backend /app/tests-start.sh
```

#### Test Coverage

Because the test scripts forward arguments to `pytest`, you can enable test coverage HTML report generation by passing `--cov-report=html`.

To run the local tests with coverage HTML reports:

```Bash
DOMAIN=backend sh ./scripts/test-local.sh --cov-report=html
```

To run the tests in a running stack with coverage HTML reports:

```bash
docker-compose exec backend bash /app/tests-start.sh --cov-report=html
```

## 🖥️ Frontend development

You will need to define the ORCID OAuth app ID and secret to enable login, you can add it to your `.bashrc` or `.zshrc` to make it automatic everytime you boot:

```bash
export ORCID_CLIENT_ID=APP-XXXX
export ORCID_CLIENT_SECRET=XXXX
```

After starting the backend with `docker-compose`, enter the `frontend/app` directory, install the NPM packages and start the live server using the scripts in `package.json`:

```bash
cd frontend/app
yarn
yarn dev
```

Then open your browser at http://localhost:19006

## 🚀 Production deployment 

Create a `.env` file with your production settings:

```bash
ORCID_CLIENT_ID=APP-XXX
ORCID_CLIENT_SECRET=XXXX
FRONTEND_URL=https://fair-enough.semanticscience.org
```

Deploy the app with production config: 

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

If the database is empty you'll need to register the initial Metrics Tests with the init script:

```bash
./init_metrics_tests.sh https://api.fair-enough.semanticscience.org
```

To stop the stack in production:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
```

## ➕ Docker Compose files and env vars

There is a main `docker-compose.yml` file with all the configurations that apply to the whole stack, it is used automatically by `docker-compose`.

And there's also a `docker-compose.override.yml` with overrides for development, for example to mount the source code as a volume. It is used automatically by `docker-compose` to apply overrides on top of `docker-compose.yml`.

These Docker Compose files use the `.env` file containing configurations to be injected as environment variables in the containers.

They also use some additional configurations taken from environment variables set in the scripts before calling the `docker-compose` command.

It is all designed to support several "stages", like development, building, testing, and deployment. Also, allowing the deployment to different environments like staging and production (and you can add more environments very easily).

They are designed to have the minimum repetition of code and configurations, so that if you need to change something, you have to change it in the minimum amount of places. That's why files use environment variables that get auto-expanded. That way, if for example, you want to use a different domain, you can call the `docker-compose` command with a different `DOMAIN` environment variable instead of having to change the domain in several places inside the Docker Compose files.

Also, if you want to have another deployment environment, say `preprod`, you just have to change environment variables, but you can keep using the same Docker Compose files.

## 🔗 Links

Livestream logs:

* https://fastapi.tiangolo.com/advanced/websockets/
* https://amittallapragada.github.io/docker/fastapi/python/2020/12/23/server-side-events.html

Project bootstrapped with https://github.com/tiangolo/full-stack-fastapi-postgresql

## 🙌 Credits

This work has been largely inspired by the [FAIR evaluator](https://fairsharing.github.io/FAIR-Evaluator-FrontEnd/#!/) in Ruby

Some code for the Metrics tests has been re-used from [F-UJI](https://github.com/pangaea-data-publisher/fuji)
