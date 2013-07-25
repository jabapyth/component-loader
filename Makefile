build: components index.js
	@component build --dev

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

open: build
	@open test/index.html

getkarma:
	@npm install -g karma

test: build getkarma
	karma start test/karma.conf.js

.PHONY: clean test
