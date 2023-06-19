

# Redis

```bash
docker run --name redis -d -p 6379:6379 redis
```

## Connecting to Redis

```bash
docker run -it --rm redis redis-cli -h 172.17.0.1
```

## Listing all the keys

```bash
keys *
```


# Local build

```bash

source .env* && FONTAWESOME_NPM_AUTH_TOKEN=$FONTAWESOME_NPM_AUTH_TOKEN docker buildx build -t ghcr.io/airwalk-digital/mdx-deck:local --secret id=FONTAWESOME_NPM_AUTH_TOKEN,env=FONTAWESOME_NPM_AUTH_TOKEN .
```

# Local Run

docker run -d -p 3001:3000 ghcr.io/airwalk-digital/airview-mdx-deck:local

