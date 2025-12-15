#!/usr/bin/env python3
"""
Get CURRENT BALANCES (not transaction history) for all chains.
This is what "how much money do I have" actually means.
"""

import requests
from decimal import Decimal
from typing import Dict, List
import json

# Your address
ADDRESS = "0x3F50f12481B76B2696f2e4316CfddD08AbE8f81E"

# Chain configurations
CHAINS = {
    "base": {
        "rpc": "https://mainnet.base.org",
        "chain_id": 8453,
        "native": "ETH",
        "explorer_api": "https://api.basescan.org/api"
    },
    "arbitrum": {
        "rpc": "https://arb1.arbitrum.io/rpc",
        "chain_id": 42161,
        "native": "ETH",
        "explorer_api": "https://api.arbiscan.io/api"
    },
    "linea": {
        "rpc": "https://rpc.linea.build",
        "chain_id": 59144,
        "native": "ETH",
        "explorer_api": "https://api.lineascan.build/api"
    },
    "avalanche": {
        "rpc": "https://api.avax.network/ext/bc/C/rpc",
        "chain_id": 43114,
        "native": "AVAX",
        "explorer_api": "https://api.snowtrace.io/api"
    }
}

# Token addresses (add more as needed)
KNOWN_TOKENS = {
    "base": {
        "USDC": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        "WETH": "0x4200000000000000000000000000000000000006"
    },
    "arbitrum": {
        "USDC": "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
        "LINK": "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4"
    },
    "linea": {
        "USDC": "0x176211869cA2b568f2A7D4EE941E073a821EE1ff"
    }
}

def get_native_balance(chain: str) -> Decimal:
    """Get native token balance (ETH/AVAX)"""
    rpc = CHAINS[chain]["rpc"]

    payload = {
        "jsonrpc": "2.0",
        "method": "eth_getBalance",
        "params": [ADDRESS, "latest"],
        "id": 1
    }

    try:
        response = requests.post(rpc, json=payload, timeout=10)
        result = response.json()

        if "result" in result:
            # Convert from wei to ether
            balance_wei = int(result["result"], 16)
            balance = Decimal(balance_wei) / Decimal(10**18)
            return balance
        else:
            print(f"⚠️  Error getting {chain} native balance: {result}")
            return Decimal(0)
    except Exception as e:
        print(f"⚠️  Failed to get {chain} native balance: {e}")
        return Decimal(0)

def get_token_balance(chain: str, token_address: str, decimals: int = 18) -> Decimal:
    """Get ERC20 token balance"""
    rpc = CHAINS[chain]["rpc"]

    # ERC20 balanceOf(address) function signature
    data = "0x70a08231000000000000000000000000" + ADDRESS[2:]

    payload = {
        "jsonrpc": "2.0",
        "method": "eth_call",
        "params": [{
            "to": token_address,
            "data": data
        }, "latest"],
        "id": 1
    }

    try:
        response = requests.post(rpc, json=payload, timeout=10)
        result = response.json()

        if "result" in result and result["result"] != "0x":
            balance_raw = int(result["result"], 16)
            balance = Decimal(balance_raw) / Decimal(10**decimals)
            return balance
        else:
            return Decimal(0)
    except Exception as e:
        print(f"⚠️  Failed to get token balance on {chain}: {e}")
        return Decimal(0)

def get_all_balances() -> Dict:
    """Get all current balances across all chains"""

    print("=" * 60)
    print("CURRENT BALANCES (STATE, NOT HISTORY)")
    print("=" * 60)
    print()

    total_by_chain = {}

    for chain_name, chain_config in CHAINS.items():
        print(f"🔗 {chain_name.upper()}")
        print("-" * 40)

        chain_total = Decimal(0)
        balances = {}

        # Get native token balance
        native = chain_config["native"]
        native_balance = get_native_balance(chain_name)
        balances[native] = float(native_balance)
        chain_total += native_balance

        print(f"  {native}: {native_balance:.6f}")

        # Get known token balances
        if chain_name in KNOWN_TOKENS:
            for token_name, token_address in KNOWN_TOKENS[chain_name].items():
                decimals = 6 if token_name == "USDC" else 18
                token_balance = get_token_balance(chain_name, token_address, decimals)

                if token_balance > 0:
                    balances[token_name] = float(token_balance)
                    print(f"  {token_name}: {token_balance:.6f}")

        total_by_chain[chain_name] = balances
        print()

    return total_by_chain

def check_nft_positions():
    """Check for NFT positions (Aerodrome CL, etc.)"""
    print("=" * 60)
    print("NFT POSITIONS (LP positions, etc.)")
    print("=" * 60)
    print()
    print("⚠️  IMPORTANT: NFT positions (like Aerodrome CL) hold value")
    print("             that is NOT shown in token balances.")
    print()
    print("You MUST check these manually:")
    print()
    print("1. Open Arkham Intelligence")
    print("2. Go to your entity → Explorer → Holdings")
    print("3. Look for 'DeFi Positions' or 'NFTs' section")
    print("4. Write down the USD value of each position")
    print()
    print("Common position types:")
    print("  - Aerodrome CL (concentrated liquidity)")
    print("  - Uniswap V3 positions")
    print("  - Staked tokens")
    print("  - Vault shares")
    print()

def check_custodial():
    """Remind about custodial balances"""
    print("=" * 60)
    print("CUSTODIAL BALANCES (BitKeep, Exchanges, etc.)")
    print("=" * 60)
    print()
    print("⚠️  CRITICAL: Once funds hit BitKeep/exchanges, they are")
    print("             NOT visible on-chain anymore.")
    print()
    print("You MUST check:")
    print()
    print("1. Open BitKeep app")
    print("2. Look at total balance (top of screen)")
    print("3. Write down the number")
    print()
    print("Same for any exchanges (Coinbase, Binance, etc.)")
    print()

if __name__ == "__main__":
    print()
    print("🔍 Getting CURRENT BALANCES for:")
    print(f"   Address: {ADDRESS}")
    print()

    # Get on-chain balances
    balances = get_all_balances()

    # Save to file
    with open("/tmp/current_balances.json", "w") as f:
        json.dump(balances, f, indent=2)

    print("=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print()
    print("✅ On-chain token balances retrieved")
    print("📁 Saved to: /tmp/current_balances.json")
    print()

    # Remind about positions and custodial
    check_nft_positions()
    check_custodial()

    print("=" * 60)
    print("NEXT STEPS")
    print("=" * 60)
    print()
    print("1. Review the token balances above")
    print("2. Add DeFi position values from Arkham")
    print("3. Add BitKeep custodial balance")
    print("4. Sum everything = your total net worth")
    print()
    print("Then you'll have the EXACT number.")
    print()
