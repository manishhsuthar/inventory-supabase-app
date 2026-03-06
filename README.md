# BnInventory

A full-stack inventory management app for hardware shops.

It tracks products, dealers, purchases, sales, stock levels, and dealer payments.

## Tech Stack

- Frontend: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- Backend: Node.js + Express (ESM)
- Database: PostgreSQL (`pg`)

## Project Structure

- `Client/` - React application (web UI + optional Electron launcher)
- `Backend/` - Express API server

## Features

- Product management (cost/selling prices, minimum stock, unit)
- Dealer management (contact details)
- Purchase entry (stock-in)
- Sales entry (stock-out)
- Dealer payment tracking
- Dashboard with:
  - Current stock levels
  - Low-stock alerts
  - Outstanding dealer balances
  - Purchase vs sales summary

## Prerequisites

- Node.js 18+
- npm
- PostgreSQL database

## Environment Variables

### Backend (`Backend/.env`)

Create `Backend/.env`:

```env
PORT=5000
DATABASE_URL=postgres://USER:PASSWORD@HOST:5432/DB_NAME
```

Notes:
- API uses `DATABASE_URL` directly in `pg.Pool`.
- SSL is enabled with `rejectUnauthorized: false` in `Backend/config/db.js`.

### Frontend (`Client/.env`)

Create `Client/.env` (optional for local default):

```env
VITE_API_BASE_URL=http://localhost:5000
```

If not set, frontend defaults to `http://localhost:5000`.

## Database Schema (Expected)

The backend expects these PostgreSQL tables:

1. `products`
- `id` (text, primary key)
- `name` (required)
- `category`
- `cost_price`
- `selling_price`
- `min_stock`
- `unit`
- `created_at` (recommended)

2. `dealers`
- `id` (text, primary key)
- `name` (required)
- `phone`
- `address`
- `created_at` (recommended)

3. `purchases`
- `id` (text, primary key)
- `product_id` (required)
- `dealer_id`
- `quantity` (required)
- `unit_price`
- `total_amount`
- `date`
- `created_at` (recommended)

4. `sales`
- `id` (text, primary key)
- `product_id` (required)
- `quantity` (required)
- `unit_price`
- `total_amount`
- `customer_name`
- `date`
- `created_at` (recommended)

5. `dealer_payments`
- Auto-created by API if missing.

## Local Development

### 1. Install dependencies

```bash
cd Backend && npm install
cd ../Client && npm install
```

### 2. Start backend

```bash
cd Backend
node server.js
```

Backend runs on `http://localhost:5000` by default.

### 3. Start frontend

```bash
cd Client
npm run dev
```

Frontend runs on `http://localhost:5173` by default.

## Available Scripts

### Backend

- `node server.js` - start API server

(There is no backend `start`/`dev` script currently in `Backend/package.json`.)

### Client

- `npm run dev` - run Vite dev server
- `npm run build` - production build
- `npm run preview` - preview built app
- `npm run electron` - launch Electron shell
- `npm run electron:dev` - run Vite + Electron together

## API Endpoints

Base URL: `http://localhost:5000`

- `GET /` - health check
- `GET /api/products`
- `POST /api/products`
- `GET /api/dealers`
- `POST /api/dealers`
- `GET /api/purchases`
- `POST /api/purchases`
- `GET /api/sales`
- `POST /api/sales`
- `GET /api/dealer-payments`
- `POST /api/dealer-payments`

## Notes

- Frontend stores UI models in camelCase and maps to backend snake_case fields.
- Current stock is derived from transactions (`purchases - sales`).
- If `purchases` or `sales` tables are missing, related endpoints return empty lists and creation calls return errors.
