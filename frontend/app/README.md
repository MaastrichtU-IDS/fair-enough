# FAIRificator, FAIR evaluation tool

[![Deploy to GitHub Pages](https://github.com/MaastrichtU-IDS/fairificator/workflows/Deploy%20website%20to%20GitHub%20Pages/badge.svg)](https://github.com/MaastrichtU-IDS/fairificator/actions/workflows/deploy-github.yml) [![CodeQL analysis](https://github.com/MaastrichtU-IDS/fairificator/workflows/CodeQL%20analysis/badge.svg)](https://github.com/MaastrichtU-IDS/fairificator/actions/workflows/codeql-analysis.yml)

Evaluate how FAIR (Findable, Accessible, Interoperable, Reusable) is a resource URL with the [FAIRsFAIR F-UJI API](https://github.com/pangaea-data-publisher/fuji)

Built with [TypeScript](https://www.typescriptlang.org/), [React](https://reactjs.org/), and [Material-UI](https://material-ui.com/). Deployed as a static website on [GitHub Pages](https://pages.github.com/).

## Access 👩‍💻

Access the website at **[https://maastrichtu-ids.github.io/fairificator 🔗](https://maastrichtu-ids.github.io/fairificator)**

It uses the API hosted at https://fair-enough.semanticscience.org/api

You can provide the resource URL to evaluate directly as a URL parameter to load the evaluation for a specific URL with `?evaluate=https://resource`

## Run in development 🏗️

Requirements:  [npm](https://www.npmjs.com/get-npm) and [yarn](https://classic.yarnpkg.com/en/docs/install/#debian-stable) installed.

Clone the repository, and get in the folder:

```bash
git clone https://github.com/MaastrichtU-IDS/fairificator 
cd fairificator
```

Install dependencies :inbox_tray:

```bash
yarn
```

Web app will run on [http://localhost:19006 🏃](http://localhost:19006)

```bash
yarn dev
```

> The website should reload automatically at each changes to the code :arrows_clockwise:

Upgrade the packages versions in `yarn.lock` ⏫️

```bash
yarn upgrade
```

## Run in production 🛩️

This website is automatically deployed by a [GitHub Actions worklow](https://github.com/MaastrichtU-IDS/fairificator/actions?query=workflow%3A%22Deploy+to+GitHub+Pages%22) to GitHub Pages at https://maastrichtu-ids.github.io/fairificator

You can build locally in the `/web-build` folder, and serve on [http://localhost:5000](http://localhost:5000)

```bash
yarn build
yarn serve
```

Or run directly using [Docker :whale:](https://docs.docker.com/get-docker/) (requires [docker installed](https://docs.docker.com/get-docker/))

```bash
docker-compose up
```

> Checkout the [docker-compose.yml](/docker-compose.yml) file to see how we run the Docker image ⛵️
