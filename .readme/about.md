## Install

```shell
npm install
```

## Run

Just execute ``npm start`` to serve the static files. Control server address through ``HOST`` and ``PORT`` env variables.

## Customise

**Do not edit the `apiConf` in `package.json`, it is auto-generated and will be overwritten**

In order to customize the build, use these env vars:

```shell
API_HOST=http://localhost:3030 STREAMER_HOST=http://localhost:1234 npm run dev  # (or npm run build)
``` 

## Build

```shell
npm run build
```

## Development

```shell
npm run dev
```
