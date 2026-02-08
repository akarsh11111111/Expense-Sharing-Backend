## Expense Sharing Backend

A small, well-structured Node.js/Express backend for managing shared expenses between users and groups. It provides endpoints to create users and groups, record expenses using multiple split types (EQUAL, EXACT, PERCENT), compute simplified balances, and record settlements between users.

This project is a prototype intended for development and experimentation: data is stored in-memory for simplicity so you can run and iterate quickly.

## Features
- Create and manage users and groups
- Add expenses with `EQUAL`, `EXACT`, and `PERCENT` split types
- Compute simplified balances (minimizes transactions between members)
- Record settlements to reduce outstanding balances
- Modular codebase that's easy to extend with persistence and auth

## Tech Stack
- Node.js (recommended >= 18)
- Express
- dotenv, helmet, cors, morgan, uuid

## Domain Concepts
- **User**: A participant in the system.
- **Group**: A collection of users. Expenses and settlements belong to a group.
- **Expense**: A payment made by a user for a group's shared costs. Each expense defines how the amount is split among members.
- **Settlement**: A payment from one user to another that reduces outstanding balances.

Balances are simplified to minimize the number of transactions by matching creditors and debtors.

## Project Structure
- `src/index.js` – App bootstrap (Express, middleware, routes, config).
- `src/config/config.js` – Environment-based configuration loader.
- `src/middleware/errorMiddleware.js` – Centralized error and 404 handlers.
- `src/models/*` – In-memory domain models and stores:
  - `userModel.js`
  - `groupModel.js`
  - `expenseModel.js`
  - `settlementModel.js`
- `src/services/balanceService.js` – Computes raw and simplified balances and per-user summaries.

## Quick start
1. Install dependencies:

```powershell
npm install
```

2. (Optional) Create a `.env` file and set `PORT` if you want a non-default port.

3. Run the app:

```powershell
npm start
```

By default the server listens on the port defined in `process.env.PORT` or `3000`.

## API Overview

- POST `/api/users` — Create a user. Body: `{ name, email }`.
- GET `/api/users` — List users.
- POST `/api/groups` — Create a group. Body: `{ name, memberIds }`.
- POST `/api/groups/:groupId/members` — Add a user to a group.
- GET `/api/groups/:groupId/balances` — Get simplified balances for a group.
- POST `/api/expenses` — Add an expense. Body example:

```json
{
  "groupId": "G1",
  "paidBy": "U1",
  "amount": 1000,
  "splitType": "EQUAL",
  "splits": [ { "userId": "U1" }, { "userId": "U2" } ],
  "description": "Dinner"
}
```

- POST `/api/settlements` — Record a settlement between users. Body:

```json
{
  "groupId": "G1",
  "fromUserId": "U2",
  "toUserId": "U1",
  "amount": 200
}
```

Split rules:
- `EQUAL`: Split the amount evenly among the listed users.
- `EXACT`: Provide each user's exact share (amounts must sum to the expense total).
- `PERCENT`: Provide percentages for each user (percentages must sum to 100).

## Development notes
- Data is stored in-memory in `src/models/*` for simplicity. To make this production-ready, replace models with a database-backed implementation (Postgres, MongoDB, etc.) and add authentication.
- Balance computations live in `src/services/balanceService.js`; controllers handle request validation and business logic.

