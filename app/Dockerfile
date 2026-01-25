FROM node:24.12.0-alpine

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

ENV NODE_ENV=development

# use before WORKDIR for it to create the directory with the correct permissions
USER node:node

WORKDIR /usr/src/app

COPY --chown=node:node . /usr/src/app

RUN npm ci

EXPOSE 3000

CMD ["npm", "run", "dev"]