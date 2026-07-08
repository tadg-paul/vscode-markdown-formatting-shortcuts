.PHONY: install compile test package clean

install:
	npm install

compile:
	npm run compile

test:
	npm test

package:
	npx vsce package

clean:
	rm -rf out node_modules *.vsix
