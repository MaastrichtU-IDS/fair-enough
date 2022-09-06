FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9

WORKDIR /app/

RUN apt-get update && apt-get install -y curl

# Install Poetry
# ENV POETRY_VERSION=1.2.0
# RUN curl -sSL https://install.python-poetry.org | python - --version $POETRY_VERSION
# ENV PATH=/root/.local/bin:$PATH
# RUN poetry config virtualenvs.create false

## Recommended by some guy on SO, but the whole poetry setup makes no freaking sense
## The whole community behind it is quite mentally challenged
# RUN poetry config virtualenvs.in-project true --local


## Old way (was working well in prod, but stopped working magically locally)
ENV POETRY_VERSION=1.1.13
RUN curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | POETRY_HOME=/opt/poetry python && \
    cd /usr/local/bin && \
    ln -s /opt/poetry/bin/poetry && \
    poetry config virtualenvs.create false


# Copy poetry.lock* in case it doesn't exist in the repo
COPY ./pyproject.toml ./poetry.lock* /app/

# Allow installing dev dependencies to run tests
ARG INSTALL_DEV=false
RUN bash -c "if [ $INSTALL_DEV == 'true' ] ; then poetry install --no-root ; else poetry install --no-root --no-dev ; fi"

# For development, Jupyter remote kernel, Hydrogen
# Using inside the container:
# jupyter lab --ip=0.0.0.0 --allow-root --NotebookApp.custom_display_url=http://127.0.0.1:8888
ARG INSTALL_JUPYTER=false
RUN bash -c "if [ $INSTALL_JUPYTER == 'true' ] ; then pip install jupyterlab ; fi"

COPY . /app


# Create non root user app
RUN addgroup --system app && adduser --system --group app

# Make sure all files belongs to the app user
RUN chown -R app:app /app && \
    chown -R app:app $HOME

USER app

ENV PYTHONPATH=/app
