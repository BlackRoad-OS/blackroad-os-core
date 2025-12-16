# Operations Portal - Deployment Guide

Deploy the BlackRoad Operations Portal to **operations.blackroad.systems**

## Quick Deploy (5 minutes)

```bash
cd operations-portal

# 1. Install dependencies
pnpm install

# 2. Build for production
pnpm build

# 3. Deploy to Cloudflare Pages
npx wrangler pages deploy out --project-name=blackroad-operations-portal

# 4. Set up custom domain (see below)
```

## Step-by-Step Deployment

### 1. Build the Project

```bash
cd /Users/alexa/blackroad-sandbox/operations-portal

pnpm install
pnpm build
```

This creates an optimized static site in the `out/` directory.

### 2. Deploy to Cloudflare Pages

#### Option A: Using Wrangler CLI (Recommended)

```bash
# Login to Cloudflare (if not already)
npx wrangler login

# Deploy
npx wrangler pages deploy out --project-name=blackroad-operations-portal
```

#### Option B: Via Cloudflare Dashboard

1. Go to https://dash.cloudflare.com
2. Navigate to **Pages**
3. Click **Create a project**
4. Choose **Upload assets**
5. Upload the `out/` folder
6. Project name: `blackroad-operations-portal`

### 3. Set Up Custom Domain

#### Via Cloudflare Dashboard

1. Go to your Pages project: `blackroad-operations-portal`
2. Click **Custom domains** tab
3. Click **Set up a custom domain**
4. Enter: `operations.blackroad.systems`
5. Click **Continue**
6. Cloudflare will automatically:
   - Create DNS records
   - Provision SSL certificate
   - Activate domain (usually 1-5 minutes)

#### Via Wrangler CLI

```bash
npx wrangler pages domain add operations.blackroad.systems --project-name=blackroad-operations-portal
```

### 4. Verify DNS

The domain should be live at: https://operations.blackroad.systems

If not, check DNS:
1. Go to Cloudflare Dashboard → `blackroad.systems` domain
2. Navigate to **DNS** → **Records**
3. Verify there's a CNAME record:
   ```
   operations  CNAME  blackroad-operations-portal.pages.dev
   ```

### 5. Set Up Access Control (Security)

⚠️ **IMPORTANT:** This is an internal portal - restrict access!

#### Using Cloudflare Access (Recommended)

1. Go to **Zero Trust** → **Access** → **Applications**
2. Click **Add an application**
3. Choose **Self-hosted**
4. Configuration:
   ```
   Application name: BlackRoad Operations Portal
   Application domain: operations.blackroad.systems
   ```
5. Click **Next**
6. Add a policy:
   ```
   Policy name: Alexa Only
   Action: Allow
   Rule type: Emails
   Value: amundsonalexa@gmail.com
   ```
7. Click **Next** → **Add application**

Now only you can access the portal (requires email verification).

#### Alternative: Basic Auth via Workers

If you prefer password protection instead:

1. Create a Worker in front of Pages
2. Add Basic Auth middleware
3. Deploy and route to `operations.blackroad.systems`

### 6. Test the Deployment

Visit: https://operations.blackroad.systems

You should see:
- ✅ Operations portal homepage
- ✅ SSL certificate (green padlock)
- ✅ All 7 sections working:
  - Overview
  - USPTO & Trademarks
  - Tax Documents
  - Stripe & Payments
  - Legal & Contracts
  - Infrastructure
  - Settings

## Updating the Portal

When you make changes:

```bash
# 1. Make your changes to the code

# 2. Rebuild
pnpm build

# 3. Redeploy
npx wrangler pages deploy out --project-name=blackroad-operations-portal

# Done! Changes are live in ~30 seconds
```

## Environment Variables

For production features (Stripe integration, etc.):

```bash
# Set environment variables via Wrangler
npx wrangler pages secret put STRIPE_SECRET_KEY --project-name=blackroad-operations-portal

# Or via Cloudflare Dashboard:
# Pages → Settings → Environment variables
```

## Troubleshooting

### Domain not working?

1. Check DNS propagation: https://dnschecker.org
2. Verify CNAME record exists
3. Wait 5-10 minutes for SSL provisioning

### Build errors?

```bash
# Clear cache and rebuild
rm -rf .next out node_modules
pnpm install
pnpm build
```

### Access denied?

- Check Cloudflare Access policies
- Verify email address is correct
- Clear browser cache and try again

## Production Checklist

Before going live:
- [ ] Build completes successfully
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Cloudflare Access enabled (security)
- [ ] Test all 7 sections
- [ ] External links working (USPTO, Stripe, etc.)
- [ ] Mobile responsive
- [ ] Dark mode working

## Costs

- **Cloudflare Pages:** FREE (unlimited bandwidth)
- **Custom domain:** Included in Cloudflare account
- **SSL certificate:** FREE (automatic)
- **Cloudflare Access:** FREE for up to 50 users

**Total cost: $0/month** 🎉

## Next Steps

After deployment:
1. Set up Cloudflare Access for security
2. Connect real Stripe API (optional)
3. Set up email notifications (optional)
4. Add document upload to R2 (optional)

---

**Need help?**
- Cloudflare Pages Docs: https://developers.cloudflare.com/pages
- Cloudflare Access Docs: https://developers.cloudflare.com/cloudflare-one/applications

**Deployed by:** Alexa Amundson
**Last updated:** December 2024
