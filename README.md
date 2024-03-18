# CT-NodeJS-Task

# Description
This application is a simple monorepo with two microservices:
- product-service - @todo update description
- review-processing-service - @todo update description

# Used technologies
- nodeJS
- TypeScript
- Eslint
- Docker & Docker compose
- NGINX as loadbalancer

# Project structure

# Api Schema



# How to run
copy `example.env` and name it `.env` then run
`docker compose up` - this command will setup containers and run microservices
Microservices will be available under `localhost` at `80` port
- `http://localhost/product-services` is url of *Product Service*
- `http://localhost/review-processing-service` is url of *Review Processing Service*

Each microservice is running in 2 instances there is a header `x-instance-id` returned with each request
to check which instance handled request

# Commands
- `npm run lint` - lint codebase
- `npm run lint:fix` - lint with fix of fixable problems
- `npm run build` - transpile TS to JS

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

