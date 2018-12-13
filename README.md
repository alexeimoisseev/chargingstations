# Charging stations app
## How to build and run

Requires npm
```
npm install
npm run build
npm run populate
npm start
```
(`build` stage is used to transpile react front-end code)

Then go to http://localhost:8080 in browser.

## How it is made

This is not a production-ready app.

Libraries used:
* `express`
* `sqlite3` as storage. Chosen to be easily used on local environment.
* `react` to show and create companies and stations.

The goal was to list all the charging stations that belong to a company and to all the companies under it in the hierarchy.

The best option for this is to use [Nested sets model](https://en.wikipedia.org/wiki/Nested_set_model) for storing companies. Inspiration was taken from [this article](http://mikehillyer.com/articles/managing-hierarchical-data-in-mysql/).

![nested sets](http://mikehillyer.com/media//nested_numbered.png)

This approach helps to query children deep in hierarchy quite fast.
But inserting new company can be a heavy operation.
I assume that creating new company happens not that often so it is acceptable.

All queries used are in `db/queries.js`.

## What is missing

* Removing companies and stations.
* Proper relational database, like PostgreSQL.
* Proper indexes.
* UI is very basic.
