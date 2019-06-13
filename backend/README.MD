# REST++ Backend Example

> An example REST backend that can be used by frontend for testing & proof of concept

## Quick Start (default configuration used)

1. Install packages

```
npm i
```

2. Create and seed the database

```
npx knex migrate:latest --env development
npx knex seed:run --env development
```

3. Run the server

```
# Windows
npm run dev

# Linux
NODE_ENV=development nodemon index.js
```

4. Test Out The REST APIs

http://127.0.0.1:3000/api-docs


## Configuration

Refer to .env-sample file for configuration keys to edit

Rename file to .env.development for development

Rename file to .env.production for production

## Backend Notes

### Project Structure

```
Folders
 +-certs (SSL certs, for lets encrypt, use the folder that they generate)
 +-docs (OpenAPI documentation)
 +-middleware (auth, logging, etc...)
 +-migrations (create database)
 +-models (database models)
 +-public (location for frontend app)
 +-routes (REST API routes)
 +-seeds (populate database)
 +-services (e.g. ORM, mongo, websockets, redis, etc)
 +-tests (TBD)
 +-uploads (local storage for file uploads)

Files
 - .env.[env] (environment file)
 - ecosystem.config.js (PM2 configuration)
 - ga.js (utility program: generation of user passwords, GA Key, QR Codes)
 - index.js
 - config.js (single source for environment variables)
 - knexfile.js (database configuration)
 - package.json
```

### Database Schema

### Simple Relation
 * books <- 1 --- 1 -> categories - one book belongs to one category
 * books <- M --- N -> authors - one book has many authors, and an author can have more than 1 book
 * books <- 1 --- M -> pages - one book has many pages

### Simple Table Schema
 * authors - id, name
 1, author1
 2, author2

 * categories - id, name
 1, cat1
 2, cat2

 * books - id, name, categoryId
 1, book1, 1
 2, book2, 1

 * pages - id, name, bookId
 1, pageA, 1
 2, pageB, 1
 3, pageC, 2
 4, pageD, 2
 5, pageE, 2

 * book_author - bookId, authorId
 1, 1
 1, 2
 2, 1
 2, 2


### Routes
[* === COMPLETED, ** === TESTED]
* POST /auth/signup
* POST /auth/login
* GET /auth/logout
* POST /auth/otp

* POST /api/authors
* PATCH /api/authors/:id
* GET /api/authors/:id
* GET /api/authors

* POST /api/categories
* PATCH /api/categories/:id
* GET /api/categories/:id
* GET /api/categories

* POST /api/books
* PATCH /api/books/:id
* GET /api/books/:id
* GET /api/books

* POST /books/:id/pages - add page to book
* DELETE /pages/:id - remove page from book
* PATCH /pages/:id - edit a page

* POST /books/:id/authors/:authorId - relate author to book
* DELETE /books/:id/authors/:authorId - unrelate author to book

GET /api/test
POST /api/upload
POST /api/uploads


## DEPLOYMENT NOTES

ExpressJS Server

Commands:
    see package.json

Config Files
    .env-sample
    .env.development
    .env.production
    knexfile.js
    ecosystem.config.js (pm2 start & stop)

Do not rely on req object, e.g. putting mongo, redis, etc. objects in req as you may also need them in websockets

Do not add to app object because app is not global and needs to be exported for other modules to use
