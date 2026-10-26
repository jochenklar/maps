.PHONY: dev build lint preview

SHELL := /bin/bash

NVM = . $(NVM_DIR)/nvm.sh && nvm use --silent &&

dev:
	$(NVM) npm run dev

build:
	$(NVM) npm run build

lint:
	$(NVM) npm run lint

preview:
	$(NVM) npm run preview
