#!/usr/bin/env python3
"""
Check Bitcoin balances for addresses in bitcoin_base58_addresses.txt
Uses blockchain.info API with rate limiting

Output: Human-friendly + parser-safe JSON with lossless precision
"""

import requests
import time
import json
from typing import Dict, List, Tuple
from datetime import datetime, timezone
from decimal import Decimal

def get_btc_price_usd() -> Tuple[str, str, str]:
    """
    Get current BTC price in USD
    Returns: (price_str, source, timestamp_utc)
    """
    try:
        response = requests.get("https://blockchain.info/ticker", timeout=10)
        response.raise_for_status()
        price = response.json()["USD"]["last"]
        timestamp = datetime.now(timezone.utc).isoformat()
        return (str(price), "blockchain.info", timestamp)
    except Exception as e:
        print(f"Error fetching BTC price from blockchain.info: {e}")
        # Fallback to CoinGecko
        try:
            response = requests.get(
                "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
                timeout=10
            )
            response.raise_for_status()
            price = response.json()["bitcoin"]["usd"]
            timestamp = datetime.now(timezone.utc).isoformat()
            return (str(price), "coingecko", timestamp)
        except Exception as e2:
            print(f"Error fetching BTC price from CoinGecko: {e2}")
            return ("0", "none", datetime.now(timezone.utc).isoformat())

def get_multi_address_balance(addresses: List[str]) -> Dict[str, int]:
    """
    Get balances for multiple addresses using blockchain.info multiaddr API
    Returns: Dict[address -> satoshis]
    """
    try:
        # blockchain.info multiaddr supports multiple addresses
        addresses_str = "|".join(addresses)
        url = f"https://blockchain.info/multiaddr?active={addresses_str}"
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        data = response.json()

        balances = {}
        for addr_data in data.get("addresses", []):
            address = addr_data["address"]
            # final_balance is in satoshis (lossless integer)
            satoshis = int(addr_data["final_balance"])
            balances[address] = satoshis

        return balances
    except Exception as e:
        print(f"Error fetching multi-address balances: {e}")
        return {}

def load_addresses(filename: str) -> List[Tuple[int, str]]:
    """Load addresses from CSV file"""
    addresses = []
    with open(filename, 'r') as f:
        for line in f:
            line = line.strip()
            if line:
                parts = line.split(',')
                if len(parts) == 2:
                    idx, address = parts
                    addresses.append((int(idx), address.strip()))
    return addresses

def sats_to_btc_str(sats: int) -> str:
    """Convert satoshis to BTC string with 8 decimal places (lossless)"""
    return f"{sats / 100000000:.8f}"

def calculate_usd(sats: int, btc_price: str) -> str:
    """Calculate USD value with precision"""
    btc = Decimal(sats) / Decimal(100000000)
    usd = btc * Decimal(btc_price)
    return str(round(usd, 2))

def main():
    print("=" * 80)
    print("Bitcoin Address Balance Checker")
    print("=" * 80)

    # Get current BTC price
    print("\n[1/4] Fetching current BTC price...")
    btc_price_str, price_source, price_timestamp = get_btc_price_usd()
    if btc_price_str == "0":
        print("⚠️  Could not fetch BTC price. Exiting.")
        return

    print(f"✅ Current BTC Price: ${float(btc_price_str):,.2f} USD (from {price_source})")

    # Load addresses
    print("\n[2/4] Loading addresses from file...")
    addresses = load_addresses("bitcoin_base58_addresses.txt")
    print(f"✅ Loaded {len(addresses)} addresses")

    # Check balances in batches
    print("\n[3/4] Checking balances (this may take a while)...")
    print("Note: Using blockchain.info API with rate limiting")

    total_sats = 0
    address_balance_map = {}  # address -> (index, satoshis)
    batch_size = 20  # blockchain.info allows ~20 addresses per request

    for i in range(0, len(addresses), batch_size):
        batch = addresses[i:i+batch_size]
        batch_addresses = [addr for idx, addr in batch]

        print(f"  Checking batch {i//batch_size + 1}/{(len(addresses)-1)//batch_size + 1} " +
              f"(addresses {i+1}-{min(i+batch_size, len(addresses))})")

        balances = get_multi_address_balance(batch_addresses)

        for idx, address in batch:
            sats = balances.get(address, 0)
            address_balance_map[address] = (idx, sats)

            if sats > 0:
                total_sats += sats
                btc_str = sats_to_btc_str(sats)
                usd_str = calculate_usd(sats, btc_price_str)
                print(f"    💰 Address {idx}: {address} = {btc_str} BTC (${usd_str})")

        # Rate limiting: wait 2 seconds between batches
        if i + batch_size < len(addresses):
            time.sleep(2)

    # Calculate totals
    print("\n[4/4] Calculating totals...")
    total_btc_str = sats_to_btc_str(total_sats)
    total_usd_str = calculate_usd(total_sats, btc_price_str)

    # Separate non-zero addresses
    non_zero_addresses = [addr for addr, (idx, sats) in address_balance_map.items() if sats > 0]
    non_zero_addresses.sort(key=lambda addr: address_balance_map[addr][1], reverse=True)

    # Results
    print("\n" + "=" * 80)
    print("RESULTS")
    print("=" * 80)
    print(f"Total addresses checked: {len(addresses):,}")
    print(f"Addresses with balance: {len(non_zero_addresses):,}")
    print(f"Total BTC: {total_btc_str} BTC")
    print(f"Total satoshis: {total_sats:,}")
    print(f"Total USD: ${float(total_usd_str):,.2f} USD")
    print(f"BTC Price: ${float(btc_price_str):,.2f} USD")
    print("=" * 80)

    # Build JSON output (Alexa's preferred format)
    generated_timestamp = datetime.now(timezone.utc).isoformat()

    results = {
        "generated_at_utc": generated_timestamp,
        "valuation": {
            "btc_usd": btc_price_str,
            "usd_source": price_source,
            "priced_at_utc": price_timestamp
        },
        "totals": {
            "btc": total_btc_str,
            "sats": total_sats,
            "usd": total_usd_str
        },
        "non_zero_addresses": non_zero_addresses,
        "address_balances": [
            {
                "address": addr,
                "index": idx,
                "btc": sats_to_btc_str(sats),
                "sats": sats,
                "usd": calculate_usd(sats, btc_price_str)
            }
            for addr, (idx, sats) in sorted(
                address_balance_map.items(),
                key=lambda x: x[1][1],  # Sort by satoshis
                reverse=True
            )
            if sats > 0
        ]
    }

    # Save main results JSON
    timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S")
    results_file = f"btc_balance_results_{timestamp_str}.json"

    with open(results_file, 'w') as f:
        json.dump(results, f, indent=2)

    print(f"\n💾 Results saved to: {results_file}")

    # Save simple text file with non-zero addresses
    if non_zero_addresses:
        non_zero_file = f"btc_non_zero_addresses_{timestamp_str}.txt"
        with open(non_zero_file, 'w') as f:
            for addr in non_zero_addresses:
                idx, sats = address_balance_map[addr]
                f.write(f"{addr}\n")

        print(f"💾 Non-zero addresses saved to: {non_zero_file}")

        print(f"\n📊 Top addresses by balance:")
        for i, addr in enumerate(non_zero_addresses[:10]):
            idx, sats = address_balance_map[addr]
            btc_str = sats_to_btc_str(sats)
            usd_str = calculate_usd(sats, btc_price_str)
            print(f"  #{i+1} (index {idx}): {addr}")
            print(f"      {btc_str} BTC = ${usd_str} USD")
    else:
        print("\n📊 No addresses with non-zero balance found.")

if __name__ == "__main__":
    main()
