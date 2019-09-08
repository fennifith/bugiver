.PHONY: all install build serve clean

all: install build

install: package-install.lock

package-install.lock: package.json
	npm install
	touch package-install.lock

build: install
	webpack-cli --config build/webpack.config.js

serve: install
	npm run dev

