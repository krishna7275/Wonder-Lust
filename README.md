# Wonder-Lust

A small Node.js / Express / MongoDB sample app for creating and browsing short-term rental listings.

Built with:
- Node.js (tested with v22.17.1)
- Express
- Mongoose (MongoDB)
- EJS + ejs-mate for templating

## Quick summary
Wonder-Lust is a lightweight CRUD app that demonstrates a listings model (title, description, image URL, price, location, country) with server-rendered EJS views and a small initializer to populate sample data.

## Project structure (relevant files)
- `app.js` — main Express server and routes
- `models/listing.js` — Mongoose schema for listings
- `views/` — EJS templates (uses `ejs-mate` layout helper)
- `init/` — data initializer (sample data + script to import into MongoDB)

## Prerequisites
- Node.js (v16+ recommended; tested on v22.17.1)
- MongoDB running locally or a reachable MongoDB URI

## Install
1. Clone the repo:

	git clone https://github.com/krishna7275/Wonder-Lust.git
	cd Wonder-Lust

2. Install dependencies:

	npm install

## Run locally
1. Start MongoDB locally (or set `MONGO_URL` env var to a remote URI).
2. Start the server:

	# from repo root
	node app.js

	# or with nodemon (if installed globally)
	nodemon app.js

3. Open http://localhost:8080

## Initialize sample data
From the `init` folder you can populate the database with sample listings:

```powershell
cd D:\Wonder-Lust\init
node .\index.js
```

Notes:
- The `init/index.js` script normalizes the sample data so the `image` field stored in MongoDB is a URL string (the current Mongoose schema expects `image` to be a String). This avoids validation errors when inserting sample objects that include `{ filename, url }`.
- Views use `ejs-mate` and the `layout(...)` helper. If you change the layout file, ensure your view files match its expected blocks.

## Routes (core)
- GET `/` — root
- GET `/listings` — index (list all listings)
- GET `/listings/new` — form to create a listing
- POST `/listings` — create a listing
- GET `/listings/:id` — show a listing
- GET `/listings/:id/edit` — edit form
- PUT `/listings/:id` — update a listing
- DELETE `/listings/:id` — delete a listing

## Development notes
- Schema: `models/listing.js` defines `image` as a String (URL). If you want to store both `filename` and `url`, consider updating the schema and migration steps.
- Template engine: `ejs-mate` is used for layouts. Use `layout('/layouts/boilerplate')` inside views.

## Contributing
PRs and issues are welcome. Small changes to improve sample data, add tests, or make initialization idempotent are great first contributions.

## License
Use as you like — add a LICENSE file if you want to specify terms.

---

If you want, I can also:
- Convert all `init/data.js` entries so each `image` field is a plain URL string (one-time change), or
- Add a short `RUNNING.md` with troubleshooting tips (MongoDB connection, permissions, nodemon).