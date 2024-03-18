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

# How to run
`docker compose up` - this command will setup containers and run microservices
Microservices will be available under `localhost` at `80` port
- `http://localhost/product-services` is url of *Product Service*
- `http://localhost/review-processing-service` is url of *Review Processing Service*

Each microservice is running in 2 instances

# Commands
- `npm run lint` - lint codebase
- `npm run lint:fix` - lint with fix of fixable problems
- `npm run build` - transpile TS to JS
