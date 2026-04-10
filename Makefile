build:
	cd frontend/ && npm run build

start:
	npx start-server -s ./frontend/dist

dev:
	npx concurrently \
	"cd frontend/ && npm run dev" \
	"npx start-server -s ./frontend/dist"