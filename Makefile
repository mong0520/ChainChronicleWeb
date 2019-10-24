build:
	docker build . -t cc-web

run:
	docker run --rm --name cc-web -d -p 5000:80 cc-web

stop:
	docker stop cc-web
