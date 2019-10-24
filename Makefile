build:
	@docker build . -t cc-web

run:
	@docker run --rm --name cc-web -d -p 8000:80 cc-web
	@echo "http://localhost:8000/web" 

stop:
	@docker stop cc-web
