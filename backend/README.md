# E-commerce Product Management System API

Laravel REST API for the admin dashboard that manages products, categories, and inventory in an e-commerce catalog. This backend provides CRUD endpoints, pagination, and seed data for local development.

## Features

- Product, category, and inventory CRUD
- REST API with pagination
- Seeders for local demo data

## Tech Stack

- Laravel
- MySQL

## Getting Started

1. Create environment file:
	- Copy .env.example to .env
	- Set DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD
2. Install dependencies:
	- composer install
3. Run migrations and seeders:
	- php artisan migrate --seed
4. Start the API server:
	- php artisan serve

API base URL: http://localhost:8000/api/v1

## API Endpoints

Base: http://localhost:8000/api/v1

- GET /categories
- POST /categories
- GET /categories/{id}
- PUT /categories/{id}
- DELETE /categories/{id}

- GET /products
- POST /products
- GET /products/{id}
- PUT /products/{id}
- DELETE /products/{id}

- GET /inventories
- POST /inventories
- GET /inventories/{id}
- PUT /inventories/{id}
- DELETE /inventories/{id}

## Testing

- php artisan test

## Notes

- CORS is enabled globally for local development.
