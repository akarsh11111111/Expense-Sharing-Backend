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
- `src/controllers/*` – Request handling aur business rules:
  - `userController.js`
  - `groupController.js`
  - `expenseController.js`
  - `settlementController.js`
- `src/routes/*` – API route definitions aur composition.


### Core API Design (High-Level)

#### Users
- **POST** `/api/users`
  - Body: `{ "name": "adarsh_shukla", "email": "adarsh_shukla@example.com" }`
  - Ek user create karta hai.
- **GET** `/api/users`
  - Saare users list karta hai.

#### Groups
- **POST** `/api/groups`
  - Body:
    ```json
    {
      "name": "Trip to Goa",
      "memberIds": ["<userId1>", "<userId2>"]
    }
    ```
  - Initial members ke saath group create karta hai (sirf existing users accept honge).

- **GET** `/api/groups`
  - Saare groups list karta hai.

- **POST** `/api/groups/:groupId/members`
  - Body: `{ "userId": "<userId>" }`
  - Ek existing user ko existing group mein add karta hai.

- **GET** `/api/groups/:groupId/balances`
  - Group ke andar simplified balances return karta hai:
  - Example response:
    ```json
    [
      { "fromUserId": "U1", "toUserId": "U2", "amount": 150.5 }
    ]
    ```

- **GET** `/api/groups/:groupId/users/:userId/balance`
  - Dikhaata hai:
    - `totalOwes` – user kitna dusron ko owe karta hai.
    - `totalOwed` – dusre user kitna is user ko owe karte hain.
    - Detailed lists of `owes` aur `owedBy`.



  - Validations:
    - `groupId`, `paidBy` exist karne chahiye aur group ka hissa hone chahiye.
    - Saare split users exist karne chahiye aur group ke members hone chahiye.
    - `EXACT` mein `splits` ke `amount` ka sum main `amount` ke barabar hona chahiye.
    - `PERCENT` mein `splits` ke `percent` ka sum 100 hona chahiye.

- **GET** `/api/expenses/group/:groupId`
  - Diye gaye group ke saare expenses list karta hai.



  

#### Settlements
- **POST** `/api/settlements`
  - Body:
    ```json
    {
      "groupId": "G1",
      "fromUserId": "U2",
      "toUserId": "U1",
      "amount": 200
    }
    ```
  

#### Expenses -- 
- **POST** `/api/expenses`
  - Body (generic shape):
    ```json
    {
      "groupId": "<groupId>",
      "paidBy": "<payerUserId>",
      "amount": 1000,
      "splitType": "EQUAL | EXACT | PERCENT",
      "splits": [],
      "description": "Dinner"
    }
    ```
    yaha pe 3 types ke expenses use kiye hai equal exact percent teeno ke defination neeche explain kr diye hai["splitType": "EQUAL | EXACT | PERCENT",]


  - **EQUAL split**:
    ```json
    {
      "groupId": "G1",
      "paidBy": "U1",
      "amount": 900,
      "splitType": "EQUAL",
      "splits": [
        { "userId": "U1" },
        { "userId": "U2" },
        { "userId": "U3" }
      ],
      "description": "Hotel"
    }
    ```

  - **EXACT split** (must sum to `amount`):
    ```json
    {
      "groupId": "G1",
      "paidBy": "U1",
      "amount": 900,
      "splitType": "EXACT",
      "splits": [
        { "userId": "U1", "amount": 300 },
        { "userId": "U2", "amount": 300 },
        { "userId": "U3", "amount": 300 }
      ]
    }
    ```

  - **PERCENT split** (percents must sum to 100):
    ```json
    {
      "groupId": "G1",
      "paidBy": "U1",
      "amount": 1000,
      "splitType": "PERCENT",
      "splits": [
        { "userId": "U1", "percent": 50 },
        { "userId": "U2", "percent": 25 },
        { "userId": "U3", "percent": 25 }
      ]
    }
    phir se ek baar explain kr de rha 
    split types**:
- **EQUAL** – Total specified users mein barabar split hota hai.
- **EXACT** – Caller har user ke liye exact amount deta hai; ye total ke barabar hona chahiye.
- **PERCENT** – Caller har user ke liye percentage deta hai; ye 100 hona chahiye.
    ```

  ----  AAGE MAI KYA KARNE WALA HU EXPAND KRNE KE LIYE --------

  - Authentication aur authorization middleware add karenge.
  - Data ko database (e.g., PostgreSQL, MongoDB) mein persist karenge.
  - Pagination, soft deletes, aur richer querying add karenge.
  - Structured logging aur metrics add karenge.
