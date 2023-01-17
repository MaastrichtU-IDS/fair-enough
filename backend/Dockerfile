FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9

WORKDIR /app/

RUN apt-get update && apt-get install -y curl

# Install Poetry (remove POETRY_VERSION= to get the latest version)
ENV PATH=/root/.local/bin:$PATH
RUN curl -sSL https://install.python-poetry.org | POETRY_VERSION=1.3.2 python3 -
RUN poetry config virtualenvs.create false


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
