# Github Container Registry





# Local build

```bash

source .env* && FONTAWESOME_NPM_AUTH_TOKEN=$FONTAWESOME_NPM_AUTH_TOKEN docker buildx build -t ghcr.io/airwalk-digital/mdx-deck:local --secret id=FONTAWESOME_NPM_AUTH_TOKEN,env=FONTAWESOME_NPM_AUTH_TOKEN .
```

# Local Run

docker run -d -p 3001:3000 ghcr.io/airwalk-digital/airview-next:local

