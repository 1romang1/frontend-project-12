install:
	npm install

build:
	npm run build

start:
	npm run start

start-backend:
	npm run start

start-frontend:
	npm run dev

develop:
	make start-backend & make start-frontend

test:
	npm test

lint:
	npm run lint
