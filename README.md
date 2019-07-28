# Pecron-api

This is a pentesting platform in the cloud, which will allow to systematically program pentesting scripts to the desired nodes. This will generate the records in real time and allow professional environments to work on the data generated immediately in vulnerability scans.

## Requirements

- OS == GNU/Linux || macOS || Windows
- Docker Compose >= 1.24
- Node.js == 10.16
- VScode >= 1.35 (**Recommended**)

## Development setup

Read: https://docs.docker.com/compose/install/

```shell
docker-compose up
```

Read: https://github.com/nvm-sh/nvm/blob/master/README.md#installation-and-update

```shell
nvm alias default v10.16.0
```

```shell
npm install
```

```shell
npm run start-dev
```

## Tools

```shell
bin/user/create.sh
```

```shell
bin/user/change-password.sh
```
