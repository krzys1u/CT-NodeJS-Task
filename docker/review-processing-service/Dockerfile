FROM node:20-alpine
LABEL name "ct-nodejs-task review-processing-service builder"

WORKDIR /opt/build

RUN apk add --update \
&& apk add --no-cache ca-certificates \
&& apk add --no-cache --virtual .build-deps curl git python3 alpine-sdk

COPY . .

RUN npm ci #--workspace @ct-nodejs-task/review-processing-service

RUN npm run build --workspace @ct-nodejs-task/review-processing-service

FROM node:20-alpine
LABEL name "ct-nodejs-task review-processing-service"
LABEL version "0.1.0"

WORKDIR /usr/review-processing-service

COPY --from=0 /opt/build ./

CMD ["node", "--enable-source-maps", "services/review-processing-service/dist/src/index.js"]
