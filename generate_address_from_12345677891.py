#!/usr/bin/env python3
"""
Generate Bitcoin address from private key: 12345677891
"""

import hashlib
import ecdsa
import base58

PRIVATE_KEY_INT = 12345677891

print("="*80)
print("BITCOIN ADDRESS GENERATION FROM PRIVATE KEY")
print("="*80)

print(f"\nPrivate Key (decimal): {PRIVATE_KEY_INT:,}")
print(f"Private Key (hex): 0x{PRIVATE_KEY_INT:x}")

# Convert to 32-byte private key (pad with zeros)
private_key_bytes = PRIVATE_KEY_INT.to_bytes(32, byteorder='big')
print(f"Private Key (32 bytes): {private_key_bytes.hex()}")

# Generate public key using secp256k1
print("\n" + "-"*80)
print("ECDSA PUBLIC KEY GENERATION")
print("-"*80)

sk = ecdsa.SigningKey.from_string(private_key_bytes, curve=ecdsa.SECP256k1)
vk = sk.get_verifying_key()

# Uncompressed public key (65 bytes)
public_key_uncompressed = b'\x04' + vk.to_string()
print(f"\nUncompressed Public Key (65 bytes):")
print(f"  {public_key_uncompressed.hex()}")

# Compressed public key (33 bytes)
x_coord = vk.pubkey.point.x()
y_coord = vk.pubkey.point.y()
prefix = b'\x02' if y_coord % 2 == 0 else b'\x03'
public_key_compressed = prefix + x_coord.to_bytes(32, byteorder='big')
print(f"\nCompressed Public Key (33 bytes):")
print(f"  {public_key_compressed.hex()}")
print(f"  Prefix: {'02 (even y)' if prefix == b'\\x02' else '03 (odd y)'}")

# Generate addresses (both compressed and uncompressed)
def generate_bitcoin_address(public_key_bytes, address_type="P2PKH"):
    """Generate Bitcoin address from public key"""

    # SHA-256 hash of public key
    sha256_hash = hashlib.sha256(public_key_bytes).digest()

    # RIPEMD-160 hash of SHA-256
    ripemd160 = hashlib.new('ripemd160')
    ripemd160.update(sha256_hash)
    ripemd160_hash = ripemd160.digest()

    # Add version byte (0x00 for mainnet P2PKH)
    versioned = b'\x00' + ripemd160_hash

    # Double SHA-256 for checksum
    checksum_full = hashlib.sha256(hashlib.sha256(versioned).digest()).digest()
    checksum = checksum_full[:4]

    # Combine and encode to Base58
    address_bytes = versioned + checksum
    address = base58.b58encode(address_bytes).decode('ascii')

    return address, ripemd160_hash.hex()

print("\n" + "-"*80)
print("BITCOIN ADDRESSES")
print("-"*80)

# Compressed address (modern standard)
addr_compressed, ripemd_compressed = generate_bitcoin_address(public_key_compressed)
print(f"\nCompressed Address (modern standard):")
print(f"  Address: {addr_compressed}")
print(f"  RIPEMD-160: {ripemd_compressed}")

# Uncompressed address (legacy)
addr_uncompressed, ripemd_uncompressed = generate_bitcoin_address(public_key_uncompressed)
print(f"\nUncompressed Address (legacy):")
print(f"  Address: {addr_uncompressed}")
print(f"  RIPEMD-160: {ripemd_uncompressed}")

# Generate WIF (Wallet Import Format) private key
print("\n" + "-"*80)
print("WALLET IMPORT FORMAT (WIF)")
print("-"*80)

# WIF for compressed public key
wif_bytes_compressed = b'\x80' + private_key_bytes + b'\x01'  # 0x01 suffix = compressed
wif_checksum_compressed = hashlib.sha256(hashlib.sha256(wif_bytes_compressed).digest()).digest()[:4]
wif_compressed = base58.b58encode(wif_bytes_compressed + wif_checksum_compressed).decode('ascii')

# WIF for uncompressed public key
wif_bytes_uncompressed = b'\x80' + private_key_bytes
wif_checksum_uncompressed = hashlib.sha256(hashlib.sha256(wif_bytes_uncompressed).digest()).digest()[:4]
wif_uncompressed = base58.b58encode(wif_bytes_uncompressed + wif_checksum_uncompressed).decode('ascii')

print(f"\nWIF (Compressed): {wif_compressed}")
print(f"WIF (Uncompressed): {wif_uncompressed}")

# Check blockchain balance
print("\n" + "-"*80)
print("BLOCKCHAIN BALANCE CHECK")
print("-"*80)

import requests
import time

def check_balance(address):
    """Check balance on blockchain"""
    try:
        response = requests.get(
            f'https://blockchain.info/q/addressbalance/{address}',
            timeout=10
        )
        if response.status_code == 200:
            balance_sats = int(response.text)
            balance_btc = balance_sats / 100000000
            return balance_sats, balance_btc
        else:
            return None, None
    except Exception as e:
        print(f"  Error: {e}")
        return None, None

print(f"\nChecking compressed address: {addr_compressed}")
sats_c, btc_c = check_balance(addr_compressed)
time.sleep(1)

print(f"\nChecking uncompressed address: {addr_uncompressed}")
sats_u, btc_u = check_balance(addr_uncompressed)

# Results
print("\n" + "="*80)
print("SUMMARY")
print("="*80)

print(f"\nPrivate Key: {PRIVATE_KEY_INT:,}")
print(f"\nAddresses Generated:")
print(f"  Compressed:   {addr_compressed}")
if sats_c is not None:
    print(f"    Balance: {btc_c:.8f} BTC ({sats_c:,} sats)")
else:
    print(f"    Balance: Unable to check")

print(f"\n  Uncompressed: {addr_uncompressed}")
if sats_u is not None:
    print(f"    Balance: {btc_u:.8f} BTC ({sats_u:,} sats)")
else:
    print(f"    Balance: Unable to check")

print(f"\n⚠️  SECURITY WARNING:")
print(f"  This is a WEAK private key (small number, predictable pattern)")
print(f"  NEVER use for real funds!")
print(f"  Anyone can derive this address and steal any funds sent to it")

print("="*80)
