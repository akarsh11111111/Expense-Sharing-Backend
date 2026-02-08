## Expense Sharing Backend

A small, well-structured Node.js/Express backend for managing shared expenses between users and groups. The API lets you create users and groups, record expenses using multiple split methods (`EQUAL`, `EXACT`, `PERCENT`), compute simplified balances, and record settlements.

This repository is a development prototype: data is stored in-memory for simplicity so you can run and iterate quickly.

## Features
- Create and manage users and groups
- Add expenses with `EQUAL`, `EXACT`, and `PERCENT` split types
- Compute simplified balances that minimize transactions
- Record settlements to reduce outstanding balances
- Modular codebase that's easy to extend with persistence and authentication

## Tech Stack
- Node.js (recommended >= 18)
- Express
- dotenv, helmet, cors, morgan, uuid

## Core Concepts
- **User**: A participant in the system.
- **Group**: A collection of users; expenses and settlements belong to a group.
- **Expense**: A payment made by a user for shared costs; defines how the amount is split among members.
- **Settlement**: A payment from one user to another that reduces outstanding balances.

Balances are simplified to minimize the number of transactions by matching creditors and debtors.

## Project Structure
- `src/index.js` – App bootstrap (Express, middleware, routes, config)
- `src/config/config.js` – Environment-based configuration loader
- `src/middleware/errorMiddleware.js` – Centralized error and 404 handlers
- `src/models/*` – In-memory domain models and stores:
  - `userModel.js`
  - `groupModel.js`
  - `expenseModel.js`
  - `settlementModel.js`
- `src/services/balanceService.js` – Computes raw and simplified balances and per-user summaries

## Quick Start
1. Install dependencies:

```powershell
npm install
```

2. (Optional) Create a `.env` file and set `PORT` to run the server on a custom port.

3. Start the app:

```powershell
npm start
```

By default the server listens on `process.env.PORT` or `3000`.

## API Overview

- POST `/api/users` — Create a user. Body: `{ name, email }`
- GET `/api/users` — List users
- POST `/api/groups` — Create a group. Body: `{ name, memberIds }`
- POST `/api/groups/:groupId/members` — Add a user to a group
- GET `/api/groups/:groupId/balances` — Get simplified balances for a group
- POST `/api/expenses` — Add an expense. Example body:

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

- POST `/api/settlements` — Record a settlement. Example body:

```json
{
  "groupId": "G1",
  "fromUserId": "U2",
  "toUserId": "U1",
  "amount": 200
}
```

Split rules:
- `EQUAL`: Split the amount evenly among the listed users
- `EXACT`: Provide each user's exact share (amounts must sum to the expense total)
- `PERCENT`: Provide percentages for each user (percentages must sum to 100)

## Development Notes
- Data is stored in-memory in `src/models/*` for simplicity. To prepare for production, replace the models with a database-backed implementation (Postgres, MongoDB, etc.) and add authentication.
- Balance computations live in `src/services/balanceService.js`; controllers handle validation and business logic.

## Next Improvements
- Add authentication and authorization
- Persist data to a database
- Add tests, structured logging, and improved validation

---

If you'd like, I can also:
- Add a `LICENSE` file
- Expand the README with detailed endpoint examples and response schemas
- Generate an OpenAPI spec or a Postman collection

Tell me which of those you'd like next.
