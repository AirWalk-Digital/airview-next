# Local build

```bash

source .env* && DOCKER_BUILDKIT=1 FONTAWESOME_NPM_AUTH_TOKEN=$FONTAWESOME_NPM_AUTH_TOKEN docker buildx build --secret id=FONTAWESOME_NPM_AUTH_TOKEN .

```

# Local Run

