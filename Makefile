.PHONY: up down

up:
	@echo "Iniciando containers..."
	docker compose up --build -d

down:
	@echo "Encerrando containers..."
	docker compose down