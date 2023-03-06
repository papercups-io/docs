---
id: development
title: Development
description: 'Setting up your development environment'
slug: /development
---

Papercups runs on Elixir/Phoenix, with a TypeScript React app for the frontend.

## Setup with `asdf` (recommended)

First, you'll need to install the following:

- Install [PostgreSQL](https://wiki.postgresql.org/wiki/Detailed_installation_guides)
- Install [Node](https://github.com/nvm-sh/nvm)
- Install [asdf](https://asdf-vm.com/#/core-manage-asdf?id=install)
- Install [Erlang dependencies](https://github.com/asdf-vm/asdf-erlang#before-asdf-install)

Once that's all set, clone the repo:

```
git clone git@github.com:papercups-io/papercups.git
cd papercups
```

And install all our dependencies:

```
asdf install
mix local.hex
mix deps.get
npm install --prefix=assets # cd assets && npm install
mix ecto.setup
mix phx.server # or `iex -S mix phx.server` for interactive mode
```

## Manual setup (deprecated)

If you haven't installed Elixir, Phoenix, NodeJS, and PostgresQL yet, you can find some great instructions here: https://hexdocs.pm/phoenix/installation.html

**tl;dr:**

- Install Elixir: https://elixir-lang.org/install.html
- Install Hex:

```
mix local.hex
```

- To check that we are on Elixir 1.6 and Erlang 20 or later, run:

```
elixir -v
Erlang/OTP 20 [erts-9.3] [source] [64-bit] [smp:8:8] [async-threads:10] [hipe] [kernel-poll:false] [dtrace]

Elixir 1.6.3
```

- Install the Phoenix application generator:

```
mix archive.install hex phx_new 1.5.4
```

- Install NodeJS: https://nodejs.org/en/download/
- Install PostgresQL: https://wiki.postgresql.org/wiki/Detailed_installation_guides

### Cloning the repo

```
git clone git@github.com:papercups-io/papercups.git
cd papercups
```

### To start your server

- Install backend dependencies with `mix deps.get`
- Install frontend dependencies with `npm install --prefix=assets` (or `cd assets && npm install`)
- Create and migrate your database with `mix ecto.setup`
- Start the server with `mix phx.server` (or `iex -S mix phx.server` for interactive mode)

This will automatically start up the React frontend in watch mode on `localhost:3000`, with the API running on `localhost:4000`.

## Frontend development

The frontend code will start up automatically when you run `mix phx.server`, but for more information see: [assets/README.md](https://github.com/papercups-io/papercups/blob/master/assets/README.md)

## Developing on Docker

You can edit your local code when developing with docker and it will update in the container.

_The docker file is made for development only at the moment_

```
docker build -t papercups . && docker-compose up
```

## Running tests

Create a PostgreSQL test database named: `chat_api_test`, and run:

```
mix test
```

## Setting up email alerts

Set the environment variables in the [`.env.example`](https://github.com/papercups-io/papercups/blob/master/.env.example) file.

At the moment we only support [Mailgun](https://www.mailgun.com/) — other messaging channels are coming soon!

## Deploying

We currently use Heroku for deployments. (This is for internal use only.)

```
git push heroku master
```
