# Flask + React + Cypress

## Flask

Run:

```sh
$ cd server
$ docker-compose up -d --build
$ docker-compose exec web python manage.py recreate_db
$ docker-compose exec web python manage.py seed_db
```

Test:

```sh
$ docker-compose exec web python manage.py test
```

## React

```sh
$ cd client
$ npm install
$ npm start
```

## Cypress

```sh
$ cd client
$ npm install
$ ./node_modules/.bin/cypress open
```
