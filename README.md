# ♻️ FAIR enough 🎯

[![Run backend tests](https://github.com/MaastrichtU-IDS/fair-enough/actions/workflows/test-backend.yml/badge.svg)](https://github.com/MaastrichtU-IDS/fair-enough/actions/workflows/test-backend.yml) [![Deploy frontend to GitHub Pages](https://github.com/MaastrichtU-IDS/fair-enough/actions/workflows/deploy-frontend.yml/badge.svg)](https://github.com/MaastrichtU-IDS/fair-enough/actions/workflows/deploy-frontend.yml) [![CodeQL analysis](https://github.com/MaastrichtU-IDS/fair-enough/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/MaastrichtU-IDS/fair-enough/actions/workflows/codeql-analysis.yml)

A service where anyone can run evaluations to assess how compliant to the FAIR principles is a resource, given the resource identifier (URI/URL).

An **evaluation** runs a **collection** of **assessments** against the resource to evaluate.

* **Evaluations** can be created by anyone without authentication. An evaluation takes the URI of the resource to evaluate, and a collection of assessments to run against this resource.
* **Collections** can be created through the API after authenticating with ORCID. A collection is a sorted list of assessments.
* **Assessments** are tests written in Python that can be part of a collection. Each assessment run some tests against the resource to evaluate, record the results, and pass the results to the next assessment in the collection. To create a test you will need to add a python file in the folder `backend/app/assessments` and send us a pull request (see below for more details)

Backend built with [FastAPI](https://fastapi.tiangolo.com/), [Pydantic](https://pydantic-docs.helpmanual.io/), Celery (RabbitMQ backend) and [MongoDB](https://www.mongodb.com/)

Frontend built with [React](https://reactjs.org) and [Material UI](https://mui.com/)

## Motivation

This work has been motivated by the existing implementations of FAIR evaluations services:

* Mark Wilkinson's [FAIR evaluator](https://fairsharing.github.io/FAIR-Evaluator-FrontEnd/#!/) is a service where people could create collections of tests, which allow communities to define their own set of FAIR assessments. But the evaluations takes too long, the codebase is in Ruby, and dependencies informations are missing which makes it hard to redeploy and test. 
* F-UJI API was written in python and already implemented a lot of interesting assessments. But it is does not allow to composes assessments, it acts as a monolythic tests suite without the possibility to create collections, or add new assessments. Moreover it's structure is not straightforward when it comes to the assessments, most tests files don't hold any assessments, they just handle the scoring, and the checks sometimes require to go through multiple functions and classes to finally found the actual code doing the assessment.

To solve those issues we took the best from Mark Wilkinson's FAIR evaluator: the possibility to define collection of assessments, and the best from F-UJI: assessments implemented in python. 

We created **FAIR Enough**: built from the ground up to make writing and contributing new FAIR assessments easy, with the goal to encourage communities to contribute assessments that matters to them, and create the collections to validate a resource FAIRness following their requirements.

We chose Python to implement this service due to:

* Its popularity and simplicity enable more people to contribute, and add their own FAIR assessments that matters to their community
* Its ecosystem is mature and contains most libraries needed to implement the assessment of online resources (e.g. extruct to extract metadata embedded in HTML, RDFLib to parse RDF metadata). As a matter of fact even the FAIR evaluator written in ruby needed to call some python dependencies like extruct! 

Even if python itself is not the fatest language, we put a lot of importance in the efficiency and simplicity of the code. Evaluations are directly started by the API (FastAPI) on a asynchronous workers (Celery) using a message broker (RabbitMQ) which can scale easily in clusters. The python files for each test in a collection are executed one after the other, each assessment adds a result entry with the score and log for the evaluated resource to an object passed down to the next.

## 📝 Add an assessment

All assessments used to run evaluations are python scripts defined in the same folder: https://github.com/MaastrichtU-IDS/fair-enough/tree/main/backend/app/assessments

Feel free to add new assessments and send a pull request!  To create a new assessment:

* Optionally, create a folder if you want to group multiple assessments under a same folder 

* Copy an existing assessment to get started

* Change the attributes of the `Assessment` class to describe it so that users can easily understand what your assessment does. Provide your ORCID URL in the `author` attribute,

* Add the code in the `evaluate()` function, 2 variables are passed to the assessment, plus you can access the assessment object itself to log what the test is trying to do, and why it success or fail:

  * `eval`: evaluation object that you can use to pass data between assessments (e.g. to pass the license URL, or JSON-LD metadata your assessment retrieves)

  * `g`: RDFLib graph of the RDF retrieved when searching for the resource metadata

  * `self`: the assessment object itself, can be used to perform various logging actions related to the test (don't use `print` otherwise it will not show up in the evaluation results returned by the API)

    ```python
    self.log('This print a regular event', '✔️') # 2nd arg (prefix added to the log) is optional
    self.success('This will also increase the score of the assessment by 1')
    self.bonus('This will also increase the bonus score of the assessment by 1')
    self.warning('This will print a warning while running the assessment')
    self.error('This will print a failure while running the assessment')
    # We provide also some helpers, e.g. to parse RDF (cf. models/assessments.py)
    g = self.parseRDF(rdf_data, 'text/turtle', msg='content negotiation RDF')
    ```

> Most of the Python code for the API is in https://github.com/MaastrichtU-IDS/fair-enough/tree/main/backend/app

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

By default, the dependencies are managed with [Poetry](https://python-poetry.org/), go there and install it.

From `./backend/` you can install all the dependencies with:

```bash
poetry install
```

To add new dependencies, run:

```bash
poetry add my-package
```

> If you don't have poetry installed locally or are facin issue with it, you can also add new packages with `docker-compose`, while the docker-compose is running run:
>
> ```bash
> docker-compose exec backend poetry add my-package
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

```
ORCID_CLIENT_ID=APP-XXX
ORCID_CLIENT_SECRET=XXXX
FRONTEND_URL=https://fair-enough.semanticscience.org
```

Deploy the app with production config: 

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
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

