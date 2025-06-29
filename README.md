# CashHandle Token Store

A Next.js application for creating and trading tokens based on HandCash handles with dividend potential. Users can mint tokens representing their HandCash handles and trade them with automatic dividend distribution from future payments.

## Features

- **HandCash Integration**: Seamless authentication with HandCash wallets
- **Automatic Token Minting**: Create tokens representing HandCash handles (e.g., $JohnTheBaker)
- **Token Trading**: Buy and sell tokens with minimum tranches of 200,000 tokens
- **Rankings System**: View token rankings by market cap, volume, and holders
- **Dividend Distribution**: Token holders receive proportional payouts from payments to HandCash handles
- **BSV Native**: Built for Bitcoin SV blockchain with support for 1sat ordinals, STAS tokens, and other BSV formats

## How It Works

### Token Economics

1. **Default Issuance**: 1 billion tokens per HandCash handle
2. **Minimum Trading Tranche**: 200,000 tokens (1 billion ÷ 5000)
3. **Dividend Eligibility**: Only holders with >200,000 tokens receive dividends
4. **Network Fee Protection**: Smaller holdings don't get payouts to avoid fees eating profits

### User Flow

1. **Connect**: Sign in with your HandCash handle
2. **Mint**: Automatically create your token (e.g., @JohnTheBaker → $JohnTheBaker)
3. **Trade**: List tokens for sale or buy others' tokens
4. **Earn**: Receive dividends from payments to the HandCash handle

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM, SQLite
- **Blockchain**: Bitcoin SV (BSV), HandCash Connect SDK
- **UI Components**: Lucide React icons, Radix UI components
- **Database**: SQLite (development), PostgreSQL (production ready)

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── handcash/
│   │   │   │   ├── login/route.ts          # HandCash OAuth login
│   │   │   │   └── callback/route.ts       # OAuth callback handler
│   │   │   └── user/route.ts               # Get current user
│   │   ├── tokens/
│   │   │   ├── create/route.ts             # Create new token
│   │   │   ├── rankings/route.ts           # Get token rankings
│   │   │   └── user/[handle]/route.ts      # Get user's token
│   │   └── marketplace/
│   │       └── orders/
│   │           ├── route.ts                # Get/create sell orders
│   │           └── [orderId]/buy/route.ts  # Execute purchase
│   ├── rankings/page.tsx                   # Token rankings page
│   ├── marketplace/page.tsx                # Trading marketplace
│   ├── layout.tsx                          # Root layout
│   └── page.tsx                           # Dashboard/home page
├── lib/
│   ├── prisma.ts                          # Prisma client
│   └── handcash.ts                        # HandCash service
└── prisma/
    └── schema.prisma                      # Database schema
```

## Database Schema

### Core Models

- **User**: HandCash account information
- **Token**: Token metadata (symbol, supply, type)
- **TokenHolding**: User token balances
- **SellOrder/BuyOrder**: Trading orders
- **DividendPayment**: Dividend distributions

## Setup Instructions

### Prerequisites

- Node.js 16+ 
- npm or yarn
- HandCash Developer Account

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="file:./dev.db"

# HandCash Configuration
HANDCASH_APP_ID="your-app-id-here"
HANDCASH_APP_SECRET="your-app-secret-here"
HANDCASH_REDIRECT_URL="http://localhost:3000/auth/handcash/callback"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"

# BSV Configuration
BSV_NETWORK="testnet"
```

### Installation

1. **Clone and install dependencies**:
```bash
npm install
```

2. **Set up the database**:
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
DATABASE_URL="file:./dev.db" npx prisma migrate dev --name init
```

3. **Start the development server**:
```bash
npm run dev
```

4. **Open your browser** to [http://localhost:3000](http://localhost:3000)

### HandCash Developer Setup

1. Sign up at [HandCash Developer Dashboard](https://dashboard.handcash.io)
2. Create a new app
3. Configure redirect URLs:
   - Success: `http://localhost:3000/auth/handcash/callback`
   - Failure: `http://localhost:3000/?error=auth-failed`
4. Copy your App ID and App Secret to `.env.local`

## Usage

### For Token Creators

1. **Connect your HandCash wallet** on the dashboard
2. **Click "Create My Token"** to mint your handle token
3. **View your token stats** including supply, price, and holders
4. **List tokens for sale** in the marketplace

### For Traders

1. **Browse the rankings** to see all available tokens
2. **Visit the marketplace** to see active sell orders
3. **Buy tokens** in minimum tranches of 200,000
4. **Hold >200,000 tokens** to receive dividend payments

### For Developers

#### Adding BSV Token Minting

Replace the TODO in `src/app/api/tokens/create/route.ts`:

```typescript
// TODO: Add BSV token minting logic here
const bsvTxId = await mintBSVToken(symbol, totalSupply);
```

#### Implementing Dividend Distribution

Add dividend logic to monitor HandCash payments and distribute to holders:

```typescript
// Monitor HandCash payments
const payments = await handCashService.getPayments(handcashHandle);
// Calculate and distribute dividends to eligible holders
await distributeDividends(tokenId, paymentAmount);
```

## Token Types Supported

- **BSV Native Tokens**: Standard BSV token format
- **1sat Ordinals**: Bitcoin ordinals on BSV
- **STAS Tokens**: Smart Token And Services protocol
- **Custom Formats**: Extensible for other BSV token standards

## Security Considerations

- **Server-Side Only**: HandCash SDK runs server-side for security
- **Session Management**: Secure cookie-based authentication
- **Database Transactions**: Atomic operations for trading
- **Input Validation**: Comprehensive validation on all endpoints
- **Rate Limiting**: Should be implemented for production

## Production Deployment

### Database

For production, switch to PostgreSQL:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/cashhandletokens"
```

Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Scaling Considerations

- **Database**: Use PostgreSQL with connection pooling
- **Caching**: Add Redis for token prices and rankings
- **File Storage**: Use cloud storage for user profiles
- **Monitoring**: Add error tracking and performance monitoring

## API Reference

### Authentication

- `GET /api/auth/handcash/login` - Initiate HandCash login
- `GET /api/auth/handcash/callback` - Handle OAuth callback  
- `GET /api/auth/user` - Get current user info

### Tokens

- `POST /api/tokens/create` - Create new token
- `GET /api/tokens/rankings` - Get token rankings
- `GET /api/tokens/user/[handle]` - Get user's token

### Marketplace

- `GET /api/marketplace/orders` - Get active sell orders
- `POST /api/marketplace/orders` - Create sell order
- `POST /api/marketplace/orders/[id]/buy` - Buy tokens

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Contact HandCash support for API-related questions
- Check the BSV documentation for blockchain integration

---

**Note**: This is a demonstration project. For production use, implement proper payment processing, security audits, and compliance with local regulations.
