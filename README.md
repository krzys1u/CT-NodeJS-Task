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


# How to run
copy `example.env` and name it `.env` then run
`docker compose up` - this command will setup containers and run microservices
Microservices will be available under `localhost` at `80` port
- `http://localhost/product-services` is url of *Product Service*
- `http://localhost/review-processing-service` is url of *Review Processing Service*

Each microservice is running in 2 instances

# Commands
- `npm run lint` - lint codebase
- `npm run lint:fix` - lint with fix of fixable problems
- `npm run build` - transpile TS to JS

# Future development
Currently there is one config stored as env variables for each container 
so review-processing service has access to products service database config, 
I've decided to keep it as it is for now as it's only showcase app, 
but in real application this things should be divided and each container should be run with set of variables it needs
