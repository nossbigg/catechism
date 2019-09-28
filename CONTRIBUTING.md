# Contributing

## Dev Setup
1. Clone this repository
2. Install JS dependencies 
```bash
yarn
```
3. Download CCC static assets
```bash
yarn build:static-assets
```

### Run dev locally
```bash
yarn start
```

### Deploy
```bash
yarn deploy
```
This step does the following tasks
- Download latest CCC static assets
- Creates production build
- Pushes build to associated github pages site

### Run tests
```bash
yarn test
```

### Run lint
```bash
yarn lint
```

### Build production build locally
```bash
yarn build
```

### Analyze production build bundle
```bash
yarn build && yarn analyze
```

### Creating a new release
```bash
git tag v<VERSION_NUMBER>
```