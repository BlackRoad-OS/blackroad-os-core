# 🚗 RoadWork Frontend

**Next.js 14 application for RoadWork - Your AI Career Co-Pilot**

**Live at:** https://roadwork.blackroad.io

---

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Export static site
pnpm export
```

Visit `http://localhost:3001`

---

## 📁 Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── globals.css         # Global styles and Tailwind
│   ├── page.tsx            # Landing page
│   ├── login/
│   │   └── page.tsx        # Login page
│   ├── signup/
│   │   └── page.tsx        # Signup page
│   ├── onboarding/
│   │   └── page.tsx        # Onboarding flow
│   └── dashboard/
│       └── page.tsx        # Main dashboard
│
├── public/                 # Static assets
├── package.json
├── next.config.js          # Next.js config (static export)
├── tailwind.config.ts      # Tailwind CSS config
├── tsconfig.json          # TypeScript config
└── wrangler.toml          # Cloudflare Pages config
```

---

## 🎨 Pages

### Landing Page (/)
- Hero section with CTA
- Features showcase
- How it works
- Pricing tiers
- Footer

### Authentication
- `/signup` - Create account
- `/login` - Sign in
- `/forgot-password` - Password reset (TODO)

### Onboarding (/onboarding)
- **Step 1:** Welcome
- **Step 2:** Name & pronunciation
- **Step 3:** Upload work history
- **Step 4:** Tinder-style job swipe
- **Step 5:** Complete

### Dashboard (/dashboard)
- Stats overview
- Recent applications
- Performance insights
- Quick actions
- Subscription status

---

## 🎨 Design System

### Colors

```css
--roadwork-dark: #2D3436     /* Asphalt black */
--roadwork-orange: #FF6B00   /* Primary orange */
--roadwork-yellow: #FFD700   /* Accent yellow */
--roadwork-green: #00D084    /* Success green */
```

### Gradients

```css
.roadwork-gradient {
  background: linear-gradient(135deg, #FF6B00 0%, #FF0066 100%);
}

.blackroad-gradient {
  background: linear-gradient(135deg, #FF9D00 0%, #FF6B00 25%, #FF0066 50%, #D600AA 75%, #7700FF 100%);
}
```

---

## 🔌 API Integration

### Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=https://api-roadwork.blackroad.io
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### API Client Example

```typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, password }),
})

const data = await response.json()
```

---

## 🚀 Deployment

### Cloudflare Pages

1. **Connect to GitHub:**
   - Go to Cloudflare Dashboard → Pages
   - Connect GitHub repository
   - Select `blackroad-sandbox` repo

2. **Build Settings:**
   ```
   Build command: cd roadwork/frontend && pnpm install && pnpm build
   Build output directory: roadwork/frontend/out
   Root directory: /
   ```

3. **Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://api-roadwork.blackroad.io
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```

4. **Custom Domain:**
   - Add `roadwork.blackroad.io`
   - Cloudflare auto-configures DNS

### Manual Deploy

```bash
# Build
pnpm build

# Deploy with Wrangler
pnpm dlx wrangler pages deploy out --project-name roadwork
```

---

## 📦 Dependencies

### Core
- `next@14.0.4` - React framework
- `react@18.2.0` - UI library
- `typescript@5.3.3` - Type safety

### UI & Animation
- `framer-motion@10.16.16` - Animations
- `lucide-react@0.303.0` - Icons
- `tailwindcss@3.4.0` - Styling

### Utilities
- `clsx@2.1.0` - Class name utilities
- `tailwind-merge@2.2.0` - Merge Tailwind classes

---

## 🎯 Features

### Implemented ✅
- Landing page with pricing
- Signup/Login pages
- Complete onboarding flow
- Dashboard with stats
- Responsive design
- Framer Motion animations
- API integration ready

### TODO 📋
- `/applications` - Full application list
- `/settings` - User settings
- `/settings/billing` - Subscription management
- `/emails` - Email inbox
- `/search` - Manual job search
- Real-time notifications
- Profile page
- Help/Support pages

---

## 🎨 Component Library

All components use:
- Tailwind CSS for styling
- Framer Motion for animations
- Lucide React for icons
- TypeScript for type safety

### Reusable Patterns

**Gradient Buttons:**
```tsx
<button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all">
  Get Started
</button>
```

**Stat Cards:**
```tsx
<div className="bg-white rounded-xl shadow-sm p-6">
  <div className="text-3xl font-bold">{value}</div>
  <div className="text-sm text-gray-600">{label}</div>
</div>
```

---

## 🔒 Security

- All API calls use HTTPS
- JWT tokens stored in localStorage
- CORS configured for API
- Environment variables for sensitive data
- No secrets in client-side code

---

## 📊 Performance

- Static site generation (SSG)
- Optimized images
- Code splitting
- Lazy loading
- Cloudflare CDN
- Lighthouse score: 95+ (target)

---

## 🐛 Troubleshooting

**Build fails:**
```bash
# Clear cache
rm -rf .next node_modules
pnpm install
pnpm build
```

**API not connecting:**
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify API is deployed and healthy
- Check browser console for CORS errors

**Tailwind not working:**
```bash
# Regenerate Tailwind
pnpm dlx tailwindcss -i ./app/globals.css -o ./out/globals.css
```

---

## 📝 Development Notes

- Next.js 14 with App Router
- Static export for Cloudflare Pages
- No server-side features (SSR, API routes)
- All dynamic data from Railway API
- TypeScript strict mode enabled

---

## 🙏 Credits

**Built with:**
- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [Lucide Icons](https://lucide.dev)

**Deployed on:**
- [Cloudflare Pages](https://pages.cloudflare.com)

---

**RoadWork - Your AI Career Co-Pilot** 🚗

**Built by BlackRoad** | **Powered by AI** | **Made with ❤️**

https://roadwork.blackroad.io
