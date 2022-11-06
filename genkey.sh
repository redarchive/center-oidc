#!/bin/bash
mkdir keys
openssl ecparam -name prime256v1 -genkey -noout -out keys/private.pem
openssl ec -in keys/private.pem -pubout -out keys/public.pem
