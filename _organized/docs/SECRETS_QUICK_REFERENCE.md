# 🔐 BlackRoad Sandbox - Secrets Quick Reference

**Last Updated**: 2025-12-12

## 🎯 Quick Access

### All Secrets Location
```bash
cd ~/blackroad-sandbox/_secrets
```

### Main Environment Files
```bash
# Core configuration
~/blackroad-sandbox/.env

# Company settings
~/blackroad-sandbox/.env.company

# Payment providers (Stripe, etc.)
~/blackroad-sandbox/.env.payment

# Production settings
~/blackroad-sandbox/.env.production
```

### Token Files
```bash
# Cloudflare DNS token
~/blackroad-sandbox/.cloudflare_dns_token

# Complete credentials inventory
~/blackroad-sandbox/_secrets/credentials-inventory.yaml

# Crypto wallet info
~/blackroad-sandbox/_secrets/crypto-holdings.yaml
```

## 🔑 Common Credentials

### Railway
```bash
# Token
grep RAILWAY_TOKEN ~/blackroad-sandbox/.env
```

### Cloudflare
```bash
# API Token
grep CLOUDFLARE_API_TOKEN ~/blackroad-sandbox/.env

# DNS Token
cat ~/blackroad-sandbox/.cloudflare_dns_token

# Account ID
grep CLOUDFLARE_ACCOUNT_ID ~/blackroad-sandbox/.env
```

### GitHub
```bash
# Full inventory
grep -A 5 "github:" ~/blackroad-sandbox/_secrets/credentials-inventory.yaml
```

### Database
```bash
# PostgreSQL URL
grep DATABASE_URL ~/blackroad-sandbox/.env
```

## 📋 Complete Inventory

For complete credential listing with all tokens, keys, and access details:
```bash
cat ~/blackroad-sandbox/_secrets/credentials-inventory.yaml
```

### What's Inside:
- **GitHub**: 15 orgs, tokens, Codespaces
- **Cloudflare**: 18+ API tokens, Workers, KV, D1
- **Railway**: Session tokens, API tokens, 12+ projects
- **Database**: PostgreSQL credentials
- **Clerk**: Auth provider keys
- **OpenAI**: API keys
- **Google Drive**: 2 accounts (rclone tokens)
- **DigitalOcean**: Droplet IP, registry
- **SSH Keys**: 8+ key pairs
- **ngrok**: Tunnel auth token
- **Kubernetes**: Docker Desktop config

## 🛡️ Security Verification

### Check Git Protection
```bash
cd ~/blackroad-sandbox
git check-ignore _secrets .env* .cloudflare_dns_token
```

Should output all these files (meaning they're ignored).

### Verify No Secrets in Git
```bash
cd ~/blackroad-sandbox
git status
```

Should NOT show any `.env*` or `_secrets/` files.

## 📞 Contact Info

### Emails
- **Primary**: amundsonalexa@gmail.com
- **Company**: blackroad.systems@gmail.com

### Infrastructure IPs
- **DigitalOcean Droplet**: 159.65.43.12
- **Raspberry Pi**: 192.168.4.49
- **iPhone Koder**: 192.168.4.68:8080

## 🔄 Token Rotation

Check `_secrets/README.md` for rotation schedule and best practices.

## 📖 Documentation

- **Full Guide**: `~/blackroad-sandbox/_secrets/README.md`
- **Consolidation Details**: `~/blackroad-sandbox/_secrets/CONSOLIDATION_SUMMARY.md`
- **This Quick Ref**: `~/blackroad-sandbox/SECRETS_QUICK_REFERENCE.md`

---

💡 **Pro Tip**: Bookmark this file for quick credential lookups!
