# BlackRoad Operations Portal

Internal operations portal for managing USPTO trademarks, tax documents, Stripe payments, legal contracts, and infrastructure.

**Access:** https://operations.blackroad.systems

## Features

### 📊 Overview Dashboard
- Quick stats for revenue, trademarks, tax documents, infrastructure
- Recent activity alerts
- Quick action buttons

### 🛡️ USPTO & Trademarks
- Track all trademark applications (BLACKROAD, ROADCOIN, ROADCHAIN)
- Monitor filing status
- Quick links to USPTO TSDR

### 📄 Tax Documents
- 2025 tax calendar with quarterly deadlines
- W-9, 1099s, estimated tax tracking
- Document upload functionality
- Automatic deadline reminders

### 💳 Stripe & Payments
- Revenue dashboard
- Active subscriptions tracking
- Product management
- Direct link to Stripe dashboard

### ⚖️ Legal & Contracts
- Terms of Service
- Privacy Policy
- Operating Agreement (Delaware LLC)
- Employee agreement templates

### 🖥️ Infrastructure
- 70+ services across Cloudflare & Railway
- Monthly cost tracking (~$20-40/mo)
- Uptime monitoring (99.9%)
- Quick links to dashboards

### ⚙️ Settings
- User preferences
- Notification settings
- Portal configuration

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Deployment:** Cloudflare Pages
- **Domain:** operations.blackroad.systems

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
# Opens on http://localhost:3010

# Build for production
pnpm build

# Deploy to Cloudflare Pages
pnpm deploy
```

## Deployment

### Automatic Deployment

```bash
cd operations-portal
pnpm install
pnpm build
npx wrangler pages deploy out --project-name=blackroad-operations-portal
```

### Manual Deployment via Cloudflare Dashboard

1. Go to https://dash.cloudflare.com
2. Pages → Create a project
3. Connect to Git or upload `out/` folder
4. Set custom domain: `operations.blackroad.systems`

## Custom Domain Setup

1. **Cloudflare Dashboard** → Pages → `blackroad-operations-portal`
2. **Custom domains** → Add custom domain
3. Enter: `operations.blackroad.systems`
4. Cloudflare automatically creates DNS records

## Security

⚠️ **This is an internal portal** - set up Cloudflare Access:

1. Go to Zero Trust → Access → Applications
2. Create new application
3. Add policy: Only allow `amundsonalexa@gmail.com`
4. Apply to `operations.blackroad.systems`

This ensures only you can access the operations portal.

## Structure

```
operations-portal/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── globals.css          # Global styles
│   ├── page.tsx             # Main dashboard (all sections)
│   └── dashboard/           # Dashboard routes (future)
├── components/              # Reusable components (future)
├── lib/                     # Utilities (future)
├── public/                  # Static assets
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── wrangler.toml            # Cloudflare deployment
└── README.md
```

## Data Sources

Currently using **mock data**. To connect real data:

### USPTO
- Use USPTO TSDR API: https://tsdr.uspto.gov/
- Store trademark serial numbers in config

### Taxes
- Integrate with accounting software (QuickBooks, etc.)
- Or manual file upload to Cloudflare R2

### Stripe
- Use Stripe API with secret key
- Display real revenue, subscriptions, products

### Infrastructure
- Pull from Cloudflare API
- Pull from Railway API
- Aggregate costs automatically

## Future Enhancements

- [ ] Real-time data integration
- [ ] Document upload to R2
- [ ] Email notifications for deadlines
- [ ] Mobile app version
- [ ] Multi-user support
- [ ] Audit logs
- [ ] Backup/export functionality
- [ ] Calendar integration

## Environment Variables

Create `.env.local`:

```bash
# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# USPTO (if API available)
USPTO_API_KEY=...

# Cloudflare
CLOUDFLARE_API_TOKEN=...
CLOUDFLARE_ACCOUNT_ID=...

# Railway
RAILWAY_API_TOKEN=...
```

## Support

For issues or questions:
- **Email:** blackroad.systems@gmail.com
- **Primary:** amundsonalexa@gmail.com

---

**Built for:** BlackRoad Systems LLC
**Owner:** Alexa Amundson
**Created:** December 2024
