# Investment Fund Backend

This is the backend service for the Investment Fund Management System. It provides a REST API for managing investments, redemptions, and fund metrics.

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Redis (v6 or higher)
- Ethereum node (local or remote)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration:
- Database credentials
- Redis connection details
- Blockchain RPC URL and contract address
- Private key for transaction signing

4. Initialize the database:
```bash
npm run db:init
```

## Development

Start the development server:
```bash
npm run dev
```

## Production

Build and start the production server:
```bash
npm run build
npm start
```

## API Endpoints

### Investments
- `POST /api/fund/invest`
  - Body: `{ "investor": "0x...", "usdAmount": "1000000" }`

### Redemptions
- `POST /api/fund/redeem`
  - Body: `{ "investor": "0x...", "shares": "1000000" }`

### Fund Metrics
- `GET /api/fund/metrics`

### Investor Balance
- `GET /api/fund/balance/:investor`

### Investment History
- `GET /api/fund/history/:investor`

## Database Management

Generate a new migration:
```bash
npm run migration:generate -- src/migrations/MigrationName
```

Run migrations:
```bash
npm run migration:run
```

Revert last migration:
```bash
npm run migration:revert
```

## Testing

Run tests:
```bash
npm test
```

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 500: Internal Server Error

Error responses include:
```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

## Architecture

The application follows a layered architecture:
- Controllers: Handle HTTP requests
- Services: Implement business logic
- Repositories: Handle data access
- Entities: Define data models

Key features:
- TypeScript for type safety
- TypeORM for database management
- Redis for caching
- Express for REST API
- Ethers.js for blockchain interaction

## Security

- Input validation using express-validator
- Environment variable management
- CORS configuration
- Error handling middleware
- Secure blockchain transaction handling 