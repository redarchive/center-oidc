# Archive 백엔드 (+ oidc)

## how to run.
### prerequirements
- node.js v18 ~
- pnpm
- mariadb
- redis
- openssl

### provisioning
- run `./genkey.sh`
- source `init.sql` on mariadb shell

### install modules
- run `pnpm i`

### start
- run `SYNC_DB=true pnpm start:dev`
