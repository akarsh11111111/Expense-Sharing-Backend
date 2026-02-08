## Expense Sharing Backend

Ek professional Node.js/Express backend expense sharing app (Splitwise jaisa) ke liye.  
Supports **groups**, **shared expenses**, **multiple split types**, **balance tracking**, aur **settlements** — simplicity ke liye in-memory storage use ki gayi hai.

### Tech Stack
- **Runtime**: Node.js (>= 18)
- **Framework**: Express
- **Validation**: Joi
- **Security & Utils**: Helmet CORS, morgan, dotenv, uuid

### Domain Concepts
- **User**: System ka ek participant.
- **Group**: Users ka collection; expenses aur settlements group ke under hote hain.
- **Expense**: Ek payment jo ek user ne group ke liye kiya, jisme split define hota hai.
- **Settlement**: Ek user se dusre user ko payment jo outstanding balances ko kam karta hai.



Balances simplified hain taaki transactions kam se kam ho (creditor/debtor matching).

### Project Structure
- `src/index.js` – App bootstrap (Express, middleware, routes, config).
- `src/config/config.js` – Environment-based config loader.
- `src/middleware/errorMiddleware.js` – Centralized error aur 404 handlers.
- `src/models/*` – In-memory domain models aur stores:
  - `userModel.js`
  - `groupModel.js`
  - `expenseModel.js`
  - `settlementModel.js`
- `src/services/balanceService.js` – Raw aur simplified balances compute karta hai; per-user summaries.
# Expense Sharing Backend

A small, well-structured Node.js backend for managing shared expenses between users and groups. It provides endpoints to create users and groups, record expenses with different split types (equal, exact, percent), compute simplified balances, and record settlements between users.

This project is a focused backend prototype — data is kept in-memory for simplicity so it is easy to run and iterate during development.

## Features
- Create and manage users and groups
- Add expenses with `EQUAL`, `EXACT`, and `PERCENT` split types
- Compute simplified balances (minimizes transactions between members)
- Record settlements to reduce outstanding balances
- Small, modular codebase ready for adding persistence and auth

## Tech Stack
- Node.js (recommended >= 18)
- Express
- dotenv, helmet, cors, morgan

## Quick start
1. Install dependencies:

```powershell
npm install
```

2. Create a `.env` file if needed (see `src/config/config.js`) and set `PORT` (optional).

3. Run the app:

```powershell
npm start
```

By default the server listens on the port from `process.env.PORT` or `3000`.

## API Overview (short)

- POST `/api/users` — create a user. Body: `{ name, email }`.
- GET `/api/users` — list users.
- POST `/api/groups` — create a group. Body: `{ name, memberIds }`.
- POST `/api/groups/:groupId/members` — add a user to a group.
- GET `/api/groups/:groupId/balances` — simplified balances for a group.
- POST `/api/expenses` — add an expense. Body example:

```json
{
  "groupId": "G1",
  "paidBy": "U1",
  "amount": 1000,
  "splitType": "EQUAL", // or EXACT, PERCENT
  "splits": [ { "userId": "U1" }, { "userId": "U2" } ],
  "description": "Dinner"
}
```

- POST `/api/settlements` — record a settlement between users. Body:

```json
{
  "groupId": "G1",
  "fromUserId": "U2",
  "toUserId": "U1",
  "amount": 200
}
```

Split rules:
- EQUAL: amount split evenly among listed users.
- EXACT: caller provides each user's exact amount (sums must match).
- PERCENT: caller provides percentages per user (must sum to 100).

## Development notes
- Data is stored in-memory in `src/models/*` for simplicity. To make this production-ready, swap models for a database-backed implementation (Postgres/MongoDB) and add authentication.
- The balance computation lives in `src/services/balanceService.js` and controllers keep request validation and business logic separated.

## Next improvements
- Add authentication & authorization
- Persist data to a database
- Add tests, structured logging, and input validation

---

If you'd like, I can also:
- Add a `LICENSE` file
- Expand the README with detailed endpoint examples
- Create a minimal Postman collection or OpenAPI spec

Tell me which of those you want next.
      "amount": 1000,
