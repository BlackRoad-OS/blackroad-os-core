# 💰 Options Calculator Pro

**Professional options pricing and analysis tool for traders.**

## What This Does

Advanced financial options calculator with:
- Black-Scholes pricing model
- Greeks calculation (Delta, Gamma, Theta, Vega, Rho)
- Profit/loss visualization
- Strategy analysis
- Real-time calculations

## Features

✅ Black-Scholes option pricing
✅ All Greeks calculated automatically
✅ Multiple strategy support
✅ Visualization tools
✅ No external dependencies
✅ Works offline

## Quick Start

```bash
# Run the calculator
python3 options_calculator.py

# Or use as a library
from options_calculator import OptionsCalculator

calc = OptionsCalculator()
price = calc.black_scholes(S=100, K=105, T=30, r=0.05, sigma=0.2, option_type='call')
```

## Requirements

- Python 3.6+
- No pip install needed (pure Python + math library)

## Use Cases

- Options traders analyzing positions
- Finance students learning pricing
- Portfolio managers calculating risk
- Anyone trading options

## Support

Questions? Email: blackroad.systems@gmail.com

## License

Single-user license. Do not redistribute.

---

**Built by Alexa Amundson**
**https://blackroad.io**
