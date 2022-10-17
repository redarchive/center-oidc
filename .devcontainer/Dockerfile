# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.245.2/containers/ubuntu/.devcontainer/base.Dockerfile

# [Choice] Ubuntu version (use ubuntu-22.04 or ubuntu-18.04 on local arm64/Apple Silicon): ubuntu-22.04, ubuntu-20.04, ubuntu-18.04
ARG VARIANT="jammy"
FROM mcr.microsoft.com/vscode/devcontainers/base:0-${VARIANT}

# [Optional] Uncomment this section to install additional OS packages.
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends npm mariadb-server redis

RUN npm i -g n
RUN n lts
RUN npm i -g pnpm

EXPOSE 3000
# RUN openssl ecparam -name prime256v1 -genkey -noout -out keys/private.pem
# RUN openssl ec -in keys/private.pem -pubout -out keys/public.pem
