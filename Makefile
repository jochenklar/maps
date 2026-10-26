.PHONY: dev build lint preview install deploy

SHELL := /bin/bash

NVM = . $(NVM_DIR)/nvm.sh && nvm use --silent &&

-include .env

dev:
	$(NVM) npm run dev

build:
	$(NVM) npm run build

lint:
	$(NVM) npm run lint

preview:
	$(NVM) npm run preview

install:
	$(NVM) npm ci

deploy: build
	@[[ "$(DEPLOY)" == ?*:?* ]] || { echo 'DEPLOY must be host:/path'; exit 1; }
	rsync -av --delete demo/dist/ $(DEPLOY)
