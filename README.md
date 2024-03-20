# CT-NodeJS-Task
The goal of this project is to create two microservices to allow storing product info and product reviews
in database and recalculate average rating of products once new reviews are added to system.


# Description
This application is a simple monorepo with two microservices:

## product-serivce
This is a service which provides api for managing products and reviews 
Requirements:
- RESTful API for products with create, delete, edit, list and get by
  identifier actions
- product information should not return reviews, only average
  product rating
- RESTful API for reviews with create, delete and edit actions
- Endpoints to show product reviews
- Service should notify review service when new review is added,
  modified or deleted

## review-processing-service 
This microservice is responsible for recalculation of products average rating
Requirements:
- Service receives events from product service
- Each time review is received, it calculates average rating and stores it
  into persistent storage
- Running in 2 separate instances
- Service must be able to process multiple events concurrently

# Project decisions
- I've decided to create separate endpoints root for product reviews because there is a separate 
requirement to do API for products and for reviews, 
- In future i would consider to move reviews endpoint as a sub-path of `/products` 
It would allow us to do not pass review ID in request body but pass it as path parameter
- I've decided to implement endpoint to show product reviews as part or `/products` route as it fits well here
- I've decided to do not store rating in separate table but along with product
- There is no database for `review-processing-service` all data is strored in database owned bv `product-service`
- Rating calculation process contain three steps
    - Get all ratings for product
    - Calculate average rating
    - Save rating to product table in `product-service` database
- As rating format wasn't specified i've decided to make a rating integer value in scale 1-5


# Used technologies
- nodeJS
- Express
- TypeScript
- Eslint
- Docker & Docker compose
- NGINX as loadbalancer
- TypeORM
- Postgres
- OpenApi schema validation
- Vitest

# Project structure
Project is a monorepo which contains one shared package with types and two services

```
- /docker - docker images
- /examples - example http requests to run 
- /nginx - nginx configuration
- /packages - shared packages
    - /types - shared types
- /services
    - /product-service
        - /aspects - aspects - used to handle async resources lifecycle actions
        - /controllers - controllers
        - /db - database
        - /middleware - express middlewares
        - /models - database models
    - /review-processing-service
```

# Api Schema
Api schema is defined in `api.json` file it's used to validate requests and responses


# How to run
copy `example.env` and name it `.env` then run
`docker compose up` - this command will setup containers and run microservices
Microservices will be available under `localhost` at `80` port
- `http://localhost/product-services` is url of *Product Service*
- `http://localhost/review-processing-service` is url of *Review Processing Service*

There is a interactive api docs available under `http://localhost/product-service/api-docs/`

Each microservice is running in 2 instances there is a header `x-instance-id` returned with each request
to check which instance handled request

# Commands
- `npm run lint` - lint codebase
- `npm run lint:fix` - lint with fix of fixable problems
- `npm run build` - transpile TS to JS
- `npm run test` - run tests

# Tests
To run tests first you need to run all containers using command `docker compose up -d `
After that run `npm run test`

I've decided to don't write unit tests as we have almost no logic in our product,
We just get request from user, validate it using open api after that we call ORM and return value
I believe ORM and validation library is well tested as well as express.

I've written few e2e tests which just call endpoints and check results,
Tests are self cleaning but before production deployment i would suggest to prevent from running it in other envs than local

# Caching
There was a requirement in specification to cache Product reviews and average product ratings,
I've decided to cache only product reviews as average rating is stored as column in product table
So if i want to cache average rating i have to cache whole product so almost whole APi
There is a header returned in response which helps to determine if response is from cache or not - `x-cache-hit`

I used redis to cache Product reviews, caching algorithm is simple:
1. If there is no cache entry for product ID
   - get product reviews from database
   - save product reviews to database with configureable TTL (set 5 minutes in config)
2. If there is entry in cahce for product ID - return it
3. If Product review is created, modified or deleted - entry is removed from cache

# Future development
## Config 
Currently there is one config stored as env variables for each container 
so review-processing service has access to products service database config, 
I've decided to keep it as it is for now as it's only showcase app, 
but in real application this things should be divided and each container should be run with set of variables it needs

## API Keys
For now API is available for anyone to make it production ready i would introduce
some kind of auth mechanism like api keys

## Pagination / Filters
There is no pagination / filters in endpoints as there were no requirements for it 
in specification. If we want to deploy it to production we have to introduce
at least pagination.

## Products deletion
I've decided to implement deleting records from database, for future it would be 
better to implement soft deletion with another column which determines if object in
database is deleted or not

## This controllers
Controllers should have only logic of getting parameters, calling some logic grouped
for example in service and return value, i've decided to write this logic in controllers
as there are simple actions using ORM but it's definitely something that i would change
if i will decide to develop this project further and make it production
ready

## Handling of ORM errors in controllers
I assumed that this application is intended to run only in local env so i didn't focus
on handling processing errors in orm, ideally each controller should be wrapped withing
try-catch and have an error handling for all ORM issues

## Docker optimisation
Currently each microservice has dependency install step during image building
I think there is a room to improvement using multistep build or some monorepo
features to install dependencies only once 
