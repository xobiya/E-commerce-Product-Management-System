# E-commerce Product Management System

Admin dashboard for managing products, categories, and inventory for an e-commerce catalog. The frontend provides CRUD screens with table views and local image previews. The backend exposes a REST API built with Laravel and MySQL.

## Features

- Product, category, and inventory CRUD
- Table-based admin views
- Local product image preview (not saved to backend)
- REST API with pagination

## Tech Stack

- Frontend: React + Vite + plain CSS
- Backend: Laravel
- Database: MySQL

## Project Structure

- backend: Laravel API
- frontend: React admin UI

## Backend Setup (Laravel)

1. Copy and configure environment:
   - Copy .env.example to .env
   - Set DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD
2. Install dependencies:
   - composer install
3. Run migrations and seeders:
   - php artisan migrate --seed
4. Start the API server:
   - php artisan serve

API base URL: http://localhost:8000/api/v1

## Frontend Setup (React)

1. Install dependencies:
   - npm install
2. (Optional) Set API URL in frontend/.env:
   - VITE_API_URL=http://localhost:8000/api/v1
3. Start the dev server:
   - npm run dev

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

## Notes

- Seed data is included via Laravel seeders.
- CORS is enabled globally for local development.
