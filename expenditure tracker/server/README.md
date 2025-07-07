# Expenditure Tracker Backend

## Setup
1. Ensure MongoDB is running locally or update `.env` with your MongoDB URI.
2. Install dependencies:
   npm install
3. Start the server:
   node index.js

The server runs on port 5000 by default.

## API Endpoints
- `GET /api/expenditures` - List all expenditures
- `POST /api/expenditures` - Add a new expenditure
- `PUT /api/expenditures/:id` - Update an expenditure
- `DELETE /api/expenditures/:id` - Delete an expenditure
