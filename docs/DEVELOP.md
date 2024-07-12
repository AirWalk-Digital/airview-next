

# Redis

```bash
docker run --name redis -d -p 6379:6379 redis

docker run -d --name redis -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
```

## Connecting to Redis

```bash
docker run -it --rm redis redis-cli -h 172.17.0.1
```

## Commands

Listing all the keys: `keys *`

Delete everything: `FLUSHALL`


# Etherpad

docker run -d --name etherpad -p 9001:9001 node bash -c "git clone https://github.com/ether/etherpad-lite.git ; cd etherpad-lite ; src/bin/run.sh --root"
 
docker exec etherpad cat /etherpad-lite/APIKEY.txt

# Setup and .dot files

You need an .env.local (see the example)

And an .npmrc file for FontAwesome


# Local build

```bash

source .env* && FONTAWESOME_NPM_AUTH_TOKEN=$FONTAWESOME_NPM_AUTH_TOKEN docker buildx build -t ghcr.io/airwalk-digital/mdx-deck:local --secret id=FONTAWESOME_NPM_AUTH_TOKEN,env=FONTAWESOME_NPM_AUTH_TOKEN .
```

# Local Run

docker run -d -p 3001:3000 ghcr.io/airwalk-digital/airview-next:local

# Debugging Deveopment

Debug the linting

```bash
TIMING=1 DEBUG=eslint:cli-engine npx eslint src/_components/Cards/Image.stories.tsx --fix
```
