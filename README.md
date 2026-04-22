# mmoa

A community-driven fundraising platform built for Ghana. Organizers create campaigns for bereavements, medical emergencies, education, and other urgent needs — contributors pay via Paystack, and organizers withdraw directly to Mobile Money.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS 4, shadcn/ui, React Query |
| Backend | Express 5, MongoDB (Mongoose), JWT (HTTP-only cookies) |
| Payments | Paystack (collections via card/MoMo, disbursements via MoMo transfer) |

## Architecture

```
mmoa/
├── web/          # React SPA (Vite)
│   └── src/
│       ├── api/           # Axios API layer
│       ├── components/    # Shared UI (shadcn)
│       ├── contexts/      # Auth context
│       ├── hooks/         # React Query hooks
│       ├── lib/           # Utilities (PDF export, time formatting)
│       └── pages/
│           ├── auth/      # Login, Register
│           ├── home/      # Dashboard, Campaign Detail, Contribute, Withdraw
│           ├── mmoa/      # How it Works, Privacy, Terms
│           └── error/     # 404
└── server/       # Express API
    ├── config/        # DB connection, env vars
    ├── controllers/   # Route handlers
    ├── helpers/       # Phone normalization, network detection, password hashing
    ├── middleware/     # JWT auth guard
    ├── models/        # Mongoose schemas (User, Campaign, Contribution, Withdrawal)
    └── routes/        # Express routers
```

## How It Works

1. **Organizer** registers, creates a campaign with a title, description, type, target amount, and optional deadline (defaults to 30 days).
2. A **shareable link** is generated (`/contribute/:slug`) — anyone with the link can contribute.
3. **Contributors** pay via Paystack. The webhook confirms payment and updates `totalRaised`.
4. **Organizer** withdraws funds to their MoMo number. The platform takes a 2.5% fee + GHS 1 Paystack transfer fee.

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB instance (local or Atlas)
- [Paystack](https://paystack.com) account with secret key and transfer recipient set up

### Environment Variables

Create `server/.env`:

```env
PORT=5000
DB_URL=mongodb://localhost:27017/mmoa
JWT_SECRET=your_jwt_secret
PAYSTACK_SECRET_KEY=sk_test_xxx
CLIENT_URL=http://localhost:5173
NODE_ENV=development
PLATFORM_RECIPIENT_CODE=RCP_xxx
```

Create `web/.env`:

```env
VITE_API_URL=http://localhost:5000
```

### Installation

```bash
# Server
cd server
npm install
npm run dev

# Web (separate terminal)
cd web
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`, the API on `http://localhost:5000`.

## API Routes

### Auth
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/v1/auth/register` | No | Create account |
| POST | `/api/v1/auth/login` | No | Login (sets HTTP-only cookie) |
| GET | `/api/v1/auth/me` | Yes | Get current user |

### Campaigns
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/v1/campaigns` | Yes | Create campaign |
| GET | `/api/v1/campaigns/me` | Yes | Get organizer's campaigns |
| GET | `/api/v1/campaigns/slug/:slug` | No | Get campaign by slug (public) |
| GET | `/api/v1/campaigns/:id` | Yes | Get campaign by ID |
| PATCH | `/api/v1/campaigns/:id/close` | Yes | Close campaign |
| PATCH | `/api/v1/campaigns/:id/extend` | Yes | Extend deadline |

### Contributions
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/v1/contributions` | No | Initialize Paystack payment |
| GET | `/api/v1/contributions/verify/:ref` | No | Verify payment |
| GET | `/api/v1/contributions/:campaignId` | Yes | Get campaign contributions |

### Withdrawals
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/v1/withdrawals/:id` | Yes | Initiate MoMo withdrawal |
| GET | `/api/v1/withdrawals/preview/:id` | Yes | Preview withdrawal breakdown |

### Webhooks
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/v1/webhooks/paystack` | Paystack event handler (charge, transfer) |

## Fee Structure

| Fee | Amount |
|-----|--------|
| Platform fee | 2.5% of available balance |
| Paystack MoMo transfer | GHS 1.00 flat |
| Minimum payout | GHS 10.00 |
| Maximum payout | GHS 50,000.00 |

## License

ISC
