---
id: heroku
title: Deploy with Heroku
description: "Deploying with Heroku"
slug: /heroku
---

## Why Heroku

Heroku is currently the quickest way to get a production Papercups environment up and running!

If you've never heard of [Heroku](https://www.heroku.com) or what it does, feel free to check out this page that provides a quick gist of the product: https://www.heroku.com/about

## Prerequisites

A Heroku account set up and verified (it's free, don't worry 😄).

## Step By Step Installation

<a href="https://heroku.com/deploy?template=https://github.com/papercups-io/papercups"><img src="https://www.herokucdn.com/deploy/button.svg" width="200px" /></a>

1. Click on the button above to go to the app creation screen.
2. Enter the desired name of your Papercups app and modify the `BACKEND_URL` and `REACT_APP_URL` config variables to match your Heroku app name.
3. and hit **Deploy App** on the bottom of the screen.
4. **Wait**. Note that this may take a few minutes, so resist the urge to refresh the page or restart the process :)
5. Once completed, you will see two options on the bottom of the screen: Manage App & View App. To go to Papercups, simply click the **View App** button!

If you want to review add-ons and other details of the instance, simply click the **Manage App** button or access the instance from your Dashboard (click on the 9 dots by your profile on the top right).

Within the Manage App screen, simply click Open App on the top right to start your Papercups environment.

## Add-Ons

By default, we install a `hobby-dev` Postgres add-on to the app - these can be found in the **Manage App** screen under **Installed add-ons**.

## Upgrading Papercups on Heroku

```
git clone https://github.com/papercups-io/papercups.git
cd papercups
git remote add heroku https://git.heroku.com/[your-heroku-papercups-app-name].git
git push -f heroku master
```
