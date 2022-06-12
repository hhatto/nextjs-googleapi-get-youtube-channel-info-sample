FROM node:14-alpine3.12 as build

ARG WORK_DIR=/apps
ARG NODE_ENV=dev
ARG NODE_OPTIONS="--max-old-space-size=2048"

WORKDIR ${WORK_DIR}

RUN apk add --no-cache libpng libpng-dev libjpeg-turbo libjpeg-turbo-dev file nasm util-linux git openssh \
  python3 make g++ gcc automake autoconf libtool pkgconfig \
  cairo-dev jpeg-dev pango-dev giflib-dev pixman-dev pangomm-dev libjpeg-turbo-dev \
  freetype-dev pixman cairo pango

COPY ./*.json ${WORK_DIR}/
COPY ./yarn.lock ${WORK_DIR}/

RUN yarn install

COPY ./public ${WORK_DIR}/public
COPY ./components ${WORK_DIR}/components
COPY ./pages ${WORK_DIR}/pages
COPY ./state ${WORK_DIR}/state
COPY ./styles ${WORK_DIR}/styles
COPY ./*.js ${WORK_DIR}/
COPY ./*.ts ${WORK_DIR}/

RUN yarn build


FROM node:14-alpine3.12 AS product

ARG WORK_DIR=/apps

ENV NODE_ENV ${NODE_ENV}

EXPOSE 3000

WORKDIR ${WORK_DIR}

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=build ${WORK_DIR}/next.config.js ./
COPY --from=build ${WORK_DIR}/public ./public
COPY --from=build ${WORK_DIR}/.next ./.next
COPY --from=build ${WORK_DIR}/node_modules ./node_modules

RUN chown -R nextjs:nodejs ${WORK_DIR}/.next
USER nextjs

CMD ["node_modules/.bin/next", "start"]
