# 💰 Bitcoin Calculator Pro

**The Bitcoin calculator that actually helps you make decisions.**

## What This Does

Advanced Bitcoin calculator with:

- BTC ↔ USD ↔ Satoshi conversions
- Price ladder (see value at different prices)
- Portfolio breakdown
- Logarithmic analysis
- Quick conversions

## Quick Start

```bash
# Run the calculator
python3 bitcoin_calculator.py

# Or use as a library
from bitcoin_calculator import BitcoinCalculator

calc = BitcoinCalculator(btc_usd_price=100_000)
print(calc.btc_to_usd(0.5))  # Convert 0.5 BTC to USD
```

## Features

✅ No external dependencies (pure Python)
✅ Formatted tables
✅ Portfolio tracking
✅ Price scenarios
✅ Logarithmic analysis
✅ Clean CLI output

## Requirements

- Python 3.6 or higher (no pip install needed!)
- Works on Mac, Linux, Windows

## Examples

```python
# Create calculator
calc = BitcoinCalculator(btc_usd_price=100_000)

# Convert BTC to USD
usd_value = calc.btc_to_usd(0.1)  # $10,000

# Convert USD to satoshis
sats = calc.usd_to_satoshi(100)  # 100,000 sats

# Analyze your portfolio
calc.portfolio_breakdown({
    'Cold Storage': 0.5,
    'Hot Wallet': 0.3
})
```

## Support

Questions? Email: alexa@blackroad.io
Updates: Follow @BlackRoadOS on Twitter

## License

Single-user license. Do not redistribute.

---

**Built by Alexa Amundson**
**https://blackroad.io**
