FROM node:18.18-alpine AS deps
# RUN apk add --no-cache libc6-compat gcompat
# RUN apk add --no-cache g++ make 

WORKDIR /app

COPY package.json package-lock.json ./
RUN --mount=type=secret,id=FONTAWESOME_NPM_AUTH_TOKEN \
    npm config set "@fortawesome:registry" https://npm.fontawesome.com/ && \
    export FONTAWESOME_NPM_AUTH_TOKEN=$(cat /run/secrets/FONTAWESOME_NPM_AUTH_TOKEN) && \
    npm config set "//npm.fontawesome.com/:_authToken" $FONTAWESOME_NPM_AUTH_TOKEN && \
    npm install && \
    echo "done"
    # find /app/node_modules/ ! -user root | xargs chown root:root


FROM node:18.18-alpine AS builder
# RUN apk add --no-cache libc6-compat gcompat
# RUN apk add --no-cache g++ make 

# RUN ln -s /lib/libc.musl-x86_64.so.1 /lib/ld-linux-x86-64.so.2
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

FROM node:18.18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "start"]
