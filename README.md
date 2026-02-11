# E-commerce Product Management System

Admin dashboard for managing products, categories, and inventory.

## Backend (Laravel)

1. Copy environment file and set database credentials for MySQL:
   - Update `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` in `backend/.env`.
2. Install dependencies if needed:
   - `composer install`
3. Run migrations and seeders:
   - `php artisan migrate --seed`
4. Start the API server:
   - `php artisan serve`

API base URL defaults to `http://localhost:8000/api/v1`.

## Frontend (React + Tailwind)

1. Install dependencies:
   - `npm install`
2. (Optional) Set API URL in `frontend/.env`:
   - `VITE_API_URL=http://localhost:8000/api/v1`
3. Start the dev server:
   - `npm run dev`

## Notes

- The API uses REST endpoints for products, categories, and inventories.
- CORS is enabled globally in the backend for local development.
