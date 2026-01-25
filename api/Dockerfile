FROM node:24.12.0-alpine

ENV NODE_ENV=development

# use before WORKDIR for it to create the directory with the correct permissions
USER node:node

WORKDIR /usr/src/app

COPY --chown=node:node . /usr/src/app

RUN npm ci
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]