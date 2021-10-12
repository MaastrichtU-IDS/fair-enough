# ♻️ FAIR enough 🎯

[![Run backend tests](https://github.com/MaastrichtU-IDS/fair-enough/actions/workflows/test-backend.yml/badge.svg)](https://github.com/MaastrichtU-IDS/fair-enough/actions/workflows/test-backend.yml)

An OpenAPI where anyone can run evaluations to assess how compliant to the FAIR principles is a resource, given the resource identifier (URI/URL).

Using [FastAPI](https://fastapi.tiangolo.com/), [Pydantic](https://pydantic-docs.helpmanual.io/) and [MongoDB](https://www.mongodb.com/)

## 📥️ Requirements

* [Docker](https://www.docker.com/)
* [Docker Compose](https://docs.docker.com/compose/install/)
* [Poetry](https://python-poetry.org/) if you need to install new Python packages.

* Node.js (with `npm`) if you need to do frontend development

## 📝 Add an assessment

All assessments used to run evaluations are python scripts defined in the same folder: https://github.com/MaastrichtU-IDS/fair-enough/tree/main/backend/app/assessments

Feel free to add new assessments and send a pull request!  To create a new assessment:

* Optionally, create a folder if you want to group multiple assessments under a same category 

* Copy an existing assessment to get started

* Change the attributes of this assessment to describe it so that users can easily understand what your assessment do. Provide your ORCID URL in the `author` attribute,

* Add the code in the `evaluate()` function, 2 variables are passed to the assessment, plus you can access the assessment object itself to log what the test is trying to do, and why it success or fail:

  * `eval`: evaluation object that you can use to pass data between assessments (e.g. to pass the license URL, or JSON-LD metadata your assessment retrieves)

  * `g`: RDFLib graph of the RDF retrieved when searching for the resource metadata

  * `self`: the assessment object itself, can be used to perform various logging actions related to the test (don't use `print` otherwise it will not show up in the evaluation results returned by the API)

    ```python
    self.log('This print a regular event', '✔️') # 2nd arg (prefix added to the log) is optional
    self.success('This will also increase the score of the assessment by 1')
    self.bonus('This will also increase the bonus score of the assessment by 1')
    self.error('This will print a failure while running the assessment')
    g = self.parseRDF(rdf_data, 'text/turtle', msg='content negotiation RDF')
    ```

> Most of the Python code for the API is in https://github.com/MaastrichtU-IDS/fair-enough/tree/main/backend/app

## 🐳 Backend local development

Start the stack for development locally with Docker Compose from the root folder of this repository:

```bash
docker-compose up -d
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

### General workflow

By default, the dependencies are managed with [Poetry](https://python-poetry.org/), go there and install it.

From `./backend/` you can install all the dependencies with:

```bash
poetry install
```

To add new dependencies, run:

```bash
poetry add my-package
```

If you install a new package you will need to stop the current docker-compose running, then restarting it to rebuild the docker image:

```bash
docker-compose up --build --force-recreate
```

You can start a shell session with the new environment with:

```bash
poetry shell
```

Next, open your editor at `./backend/` (instead of the project root: `./`), so that you see an `./app/` directory with your code inside. That way, your editor will be able to find all the imports, etc. Make sure your editor uses the environment you just created with Poetry.

### Docker Compose Override

During development, you can change Docker Compose settings that will only affect the local development environment, in the file `docker-compose.override.yml`

```bash
docker-compose up -d
```

To get inside the container with a `bash` session you can `exec` inside the running container:

```console
docker-compose exec backend bash
```

### Backend tests

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

#### Test new stack

To test the backend run:

```console
DOMAIN=backend sh ./scripts/test.sh
```

The file `./scripts/test.sh` has the commands to generate a testing `docker-stack.yml` file, start the stack and test it.

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

* Enter the `frontend` directory, install the NPM packages and start the live server using the `npm` scripts:

```bash
cd frontend
npm install
npm run serve
```

Then open your browser at http://localhost:8080

If you have Vue CLI installed, you can also run `vue ui` to control, configure, serve, and analyze your application using a nice local web user interface.

## 🚀 Deployment 

### Traefik network

This stack expects the public Traefik network to be named `traefik-public`, just as in the tutorials in <a href="https://dockerswarm.rocks" class="external-link" target="_blank">DockerSwarm.rocks</a>.

If you need to use a different Traefik public network name, update it in the `docker-compose.yml` files, in the section:

```YAML
networks:
  traefik-public:
    external: true
```

Change `traefik-public` to the name of the used Traefik network. And then update it in the file `.env`:

```bash
TRAEFIK_PUBLIC_NETWORK=traefik-public
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

