## Install

```shell
npm install
```

## Run in third-party webserver

Point your webserver config to the ``dist`` directory. Configure your webserver to serve ``index.html`` with a 200 status code instead of a 404 error page.

## Run as standalone server

Execute ``npm start`` to start the built-in webserver. Control server address through ``HOST`` and ``PORT`` env variables.

## Customise

In order to customize the build, use these env vars:

```shell
API_HOST=http://localhost:3030 STREAMER_HOST=http://localhost:1234 npm run dev  # (or npm run build)
``` 

## Build

To remove any prior build artifacts run `npm run clean`.

```shell
npm run build
```

## Development

```shell
npm run dev
```
