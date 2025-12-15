#!/usr/bin/env python3
"""
Analyze the TRUE derivation method:
Private Key: 12,345,677,891
Results in: bc1qqf4l8mj0cjz6gqvvjdmqmdkez5x2gq4smu5fr4

This is a bech32 (native SegWit) address, NOT a P2PKH address!
Use this to understand the 22,000 address generation.
"""

import hashlib
import ecdsa
from typing import Tuple

PRIVATE_KEY_INT = 12345677891
EXPECTED_ADDRESS = "bc1qqf4l8mj0cjz6gqvvjdmqmdkez5x2gq4smu5fr4"

print("="*80)
print("ANALYZING TRUE DERIVATION METHOD")
print("="*80)

print(f"\nGiven:")
print(f"  Private Key: {PRIVATE_KEY_INT:,}")
print(f"  Expected Address: {EXPECTED_ADDRESS}")
print(f"  Address Type: bc1q = Bech32 (P2WPKH - native SegWit)")

# Generate public key
private_key_bytes = PRIVATE_KEY_INT.to_bytes(32, byteorder='big')
sk = ecdsa.SigningKey.from_string(private_key_bytes, curve=ecdsa.SECP256k1)
vk = sk.get_verifying_key()

# Compressed public key
x_coord = vk.pubkey.point.x()
y_coord = vk.pubkey.point.y()
prefix = b'\x02' if y_coord % 2 == 0 else b'\x03'
public_key_compressed = prefix + x_coord.to_bytes(32, byteorder='big')

print(f"\nPublic Key (compressed): {public_key_compressed.hex()}")

# Generate witness program (P2WPKH)
# For P2WPKH: OP_0 <20-byte-hash>
# The 20-byte-hash is HASH160(public_key) = RIPEMD160(SHA256(public_key))

sha256_hash = hashlib.sha256(public_key_compressed).digest()
print(f"SHA-256 of pubkey: {sha256_hash.hex()}")

ripemd160 = hashlib.new('ripemd160')
ripemd160.update(sha256_hash)
pubkey_hash = ripemd160.digest()
print(f"RIPEMD-160 (witness program): {pubkey_hash.hex()}")

# Bech32 encoding
def bech32_polymod(values):
    """Internal function for bech32 checksum"""
    GEN = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3]
    chk = 1
    for value in values:
        b = chk >> 25
        chk = (chk & 0x1ffffff) << 5 ^ value
        for i in range(5):
            chk ^= GEN[i] if ((b >> i) & 1) else 0
    return chk

def bech32_hrp_expand(hrp):
    """Expand the HRP into values for checksum computation"""
    return [ord(x) >> 5 for x in hrp] + [0] + [ord(x) & 31 for x in hrp]

def bech32_verify_checksum(hrp, data):
    """Verify a checksum given HRP and converted data characters"""
    return bech32_polymod(bech32_hrp_expand(hrp) + data) == 1

def bech32_create_checksum(hrp, data):
    """Compute the checksum values given HRP and data"""
    values = bech32_hrp_expand(hrp) + data
    polymod = bech32_polymod(values + [0, 0, 0, 0, 0, 0]) ^ 1
    return [(polymod >> 5 * (5 - i)) & 31 for i in range(6)]

def bech32_encode(hrp, witver, witprog):
    """Encode a segwit address"""
    CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l"

    # Convert witness program to 5-bit groups
    data = [witver] + convertbits(witprog, 8, 5)
    if data is None:
        return None

    # Create checksum
    combined = data + bech32_create_checksum(hrp, data)

    # Encode
    return hrp + '1' + ''.join([CHARSET[d] for d in combined])

def convertbits(data, frombits, tobits, pad=True):
    """General power-of-2 base conversion"""
    acc = 0
    bits = 0
    ret = []
    maxv = (1 << tobits) - 1
    max_acc = (1 << (frombits + tobits - 1)) - 1
    for value in data:
        if value < 0 or (value >> frombits):
            return None
        acc = ((acc << frombits) | value) & max_acc
        bits += frombits
        while bits >= tobits:
            bits -= tobits
            ret.append((acc >> bits) & maxv)
    if pad:
        if bits:
            ret.append((acc << (tobits - bits)) & maxv)
    elif bits >= frombits or ((acc << (tobits - bits)) & maxv):
        return None
    return ret

# Generate bech32 address
witness_version = 0  # For P2WPKH
witness_program = list(pubkey_hash)

generated_address = bech32_encode("bc", witness_version, witness_program)

print(f"\n" + "-"*80)
print("BECH32 ADDRESS GENERATION")
print("-"*80)
print(f"\nGenerated Address: {generated_address}")
print(f"Expected Address:  {EXPECTED_ADDRESS}")
print(f"Match: {'✅ YES' if generated_address == EXPECTED_ADDRESS else '❌ NO'}")

if generated_address != EXPECTED_ADDRESS:
    print(f"\n⚠️  MISMATCH! Let me check if you meant something else...")

    # Maybe it's using the public key hash differently?
    print(f"\nAlternative interpretations:")

    # Direct hash of private key?
    private_hash = hashlib.sha256(private_key_bytes).digest()
    private_ripemd = hashlib.new('ripemd160')
    private_ripemd.update(private_hash)
    private_hash160 = private_ripemd.digest()

    alt_address = bech32_encode("bc", 0, list(private_hash160))
    print(f"  From SHA256(privkey): {alt_address}")
    print(f"  Match: {'✅ YES' if alt_address == EXPECTED_ADDRESS else '❌ NO'}")

# Now let's reverse engineer what WOULD create that address
print(f"\n" + "-"*80)
print("REVERSE ENGINEERING THE EXPECTED ADDRESS")
print("-"*80)

def bech32_decode(bech):
    """Decode a bech32 string"""
    CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l"

    if ((any(ord(x) < 33 or ord(x) > 126 for x in bech)) or
            (bech.lower() != bech and bech.upper() != bech)):
        return (None, None)

    bech = bech.lower()
    pos = bech.rfind('1')
    if pos < 1 or pos + 7 > len(bech) or len(bech) > 90:
        return (None, None)

    if not all(x in CHARSET for x in bech[pos+1:]):
        return (None, None)

    hrp = bech[:pos]
    data = [CHARSET.find(x) for x in bech[pos+1:]]

    if not bech32_verify_checksum(hrp, data):
        return (None, None)

    return (hrp, data[:-6])

hrp, data = bech32_decode(EXPECTED_ADDRESS)
if data:
    print(f"  HRP: {hrp}")
    print(f"  Witness version: {data[0]}")

    # Convert back to bytes
    witness_program_bytes = bytes(convertbits(data[1:], 5, 8, False))
    print(f"  Witness program (20 bytes): {witness_program_bytes.hex()}")

    print(f"\n  This is the RIPEMD-160 hash we need to match!")
    print(f"  Our generated hash:  {pubkey_hash.hex()}")
    print(f"  Expected hash:       {witness_program_bytes.hex()}")
    print(f"  Match: {'✅ YES' if pubkey_hash.hex() == witness_program_bytes.hex() else '❌ NO'}")

# Check balance of expected address
print(f"\n" + "-"*80)
print("BLOCKCHAIN CHECK")
print("-"*80)

import requests

try:
    # For bc1 addresses, we need to convert to check
    # blockchain.info doesn't support bc1 directly, try blockstream
    response = requests.get(
        f'https://blockstream.info/api/address/{EXPECTED_ADDRESS}',
        timeout=10
    )
    if response.status_code == 200:
        data = response.json()
        funded = data.get('chain_stats', {}).get('funded_txo_sum', 0)
        spent = data.get('chain_stats', {}).get('spent_txo_sum', 0)
        balance = funded - spent

        print(f"\nAddress: {EXPECTED_ADDRESS}")
        print(f"  Total received: {funded:,} sats ({funded/1e8:.8f} BTC)")
        print(f"  Total spent: {spent:,} sats ({spent/1e8:.8f} BTC)")
        print(f"  Current balance: {balance:,} sats ({balance/1e8:.8f} BTC)")
        print(f"  Transaction count: {data.get('chain_stats', {}).get('tx_count', 0)}")
except Exception as e:
    print(f"  Error checking balance: {e}")

print("\n" + "="*80)
