#!/usr/bin/env python3
# ============================================================================
# BlackRoad OS - Proprietary Software
# Copyright (c) 2025 BlackRoad OS, Inc. / Alexa Louise Amundson
# All Rights Reserved.
# ============================================================================

"""
BlackRoad Blockchain Service
Port: 9800

A lightweight blockchain implementation for BlackRoad OS with:
- Block creation and validation
- Transaction management
- Wallet operations
- Smart contract execution
- Mining simulation
- Blockchain explorer API

Easter Egg: Contains references to the genesis block and early Bitcoin history 🎉

Endpoints:
- POST /api/blockchain/mine - Mine a new block
- POST /api/blockchain/transaction/new - Create transaction
- GET /api/blockchain/chain - Get full blockchain
- GET /api/blockchain/block/{index} - Get specific block
- POST /api/blockchain/wallet/create - Create new wallet
- GET /api/blockchain/wallet/{address}/balance - Get wallet balance
- POST /api/blockchain/contract/deploy - Deploy smart contract
- GET /api/blockchain/stats - Blockchain statistics
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import hashlib
import json

app = Flask(__name__)
CORS(app)

# ============================================================================
# BLOCKCHAIN IMPLEMENTATION
# ============================================================================

class Block:
    def __init__(self, index, timestamp, transactions, previous_hash, nonce=0):
        self.index = index
        self.timestamp = timestamp
        self.transactions = transactions
        self.previous_hash = previous_hash
        self.nonce = nonce
        self.hash = self.calculate_hash()

    def calculate_hash(self):
        """Calculate SHA-256 hash of block"""
        block_string = json.dumps({
            "index": self.index,
            "timestamp": self.timestamp,
            "transactions": self.transactions,
            "previous_hash": self.previous_hash,
            "nonce": self.nonce
        }, sort_keys=True)
        return hashlib.sha256(block_string.encode()).hexdigest()

    def to_dict(self):
        return {
            "index": self.index,
            "timestamp": self.timestamp,
            "transactions": self.transactions,
            "previous_hash": self.previous_hash,
            "nonce": self.nonce,
            "hash": self.hash
        }

class Blockchain:
    def __init__(self):
        self.chain = []
        self.pending_transactions = []
        self.difficulty = 4  # Number of leading zeros required
        self.mining_reward = 50  # Like early Bitcoin blocks!
        self.create_genesis_block()

    def create_genesis_block(self):
        """
        Create the genesis block with a tribute to Bitcoin's genesis block
        Satoshi's genesis block: "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"
        """
        genesis_transactions = [{
            "from": "genesis",
            "to": "satoshi_tribute",
            "amount": 50,
            "data": "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks",
            "note": "Tribute to Satoshi Nakamoto and the Bitcoin genesis block"
        }]

        genesis_block = Block(0, "2009-01-03T18:15:05Z", genesis_transactions, "0")
        # Fun fact: Bitcoin genesis block timestamp!
        self.chain.append(genesis_block)

    def get_latest_block(self):
        return self.chain[-1]

    def mine_pending_transactions(self, mining_reward_address):
        """Mine a new block with pending transactions"""
        # Add mining reward transaction
        reward_transaction = {
            "from": "network",
            "to": mining_reward_address,
            "amount": self.mining_reward,
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }

        self.pending_transactions.append(reward_transaction)

        # Create new block
        block = Block(
            len(self.chain),
            datetime.utcnow().isoformat() + "Z",
            self.pending_transactions,
            self.get_latest_block().hash
        )

        # Proof of Work
        while not block.hash.startswith('0' * self.difficulty):
            block.nonce += 1
            block.hash = block.calculate_hash()

        self.chain.append(block)
        self.pending_transactions = []

        return block

    def create_transaction(self, from_address, to_address, amount, data=None):
        """Create a new transaction"""
        transaction = {
            "from": from_address,
            "to": to_address,
            "amount": amount,
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }

        if data:
            transaction["data"] = data

        self.pending_transactions.append(transaction)
        return transaction

    def get_balance(self, address):
        """Get balance for an address"""
        balance = 0

        for block in self.chain:
            for transaction in block.transactions:
                if transaction["from"] == address:
                    balance -= transaction["amount"]
                if transaction["to"] == address:
                    balance += transaction["amount"]

        return balance

    def is_chain_valid(self):
        """Validate the blockchain"""
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i - 1]

            # Check hash
            if current_block.hash != current_block.calculate_hash():
                return False

            # Check previous hash link
            if current_block.previous_hash != previous_block.hash:
                return False

            # Check proof of work
            if not current_block.hash.startswith('0' * self.difficulty):
                return False

        return True

# Initialize blockchain
blockchain = Blockchain()

# Wallets
wallets = {
    "satoshi": {
        "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",  # Actual first Bitcoin address!
        "created": "2009-01-03T18:15:05Z",
        "note": "The first Bitcoin address - genesis block recipient"
    }
}

# Smart contracts
smart_contracts = {}

# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "ok": True,
        "service": "blackroad-blockchain",
        "port": 9800,
        "blockchain_height": len(blockchain.chain),
        "difficulty": blockchain.difficulty,
        "mining_reward": blockchain.mining_reward
    })

@app.route("/api/blockchain/mine", methods=["POST"])
def mine_block():
    """Mine a new block"""
    try:
        data = request.get_json()
        miner_address = data.get("miner_address", "default_miner")

        if len(blockchain.pending_transactions) == 0:
            return jsonify({
                "ok": False,
                "error": "No transactions to mine"
            }), 400

        # Mine the block
        new_block = blockchain.mine_pending_transactions(miner_address)

        return jsonify({
            "ok": True,
            "block": new_block.to_dict(),
            "message": f"Block #{new_block.index} mined successfully",
            "reward": blockchain.mining_reward
        })

    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/blockchain/transaction/new", methods=["POST"])
def new_transaction():
    """Create a new transaction"""
    try:
        data = request.get_json()

        from_address = data.get("from")
        to_address = data.get("to")
        amount = data.get("amount")
        tx_data = data.get("data")

        if not all([from_address, to_address, amount]):
            return jsonify({
                "ok": False,
                "error": "Missing required fields: from, to, amount"
            }), 400

        # Check balance
        if from_address != "genesis":
            balance = blockchain.get_balance(from_address)
            if balance < amount:
                return jsonify({
                    "ok": False,
                    "error": f"Insufficient balance. Have: {balance}, Need: {amount}"
                }), 400

        transaction = blockchain.create_transaction(from_address, to_address, amount, tx_data)

        return jsonify({
            "ok": True,
            "transaction": transaction,
            "message": "Transaction added to pending transactions",
            "pending_count": len(blockchain.pending_transactions)
        })

    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/blockchain/chain", methods=["GET"])
def get_chain():
    """Get the full blockchain"""
    try:
        chain_data = [block.to_dict() for block in blockchain.chain]

        return jsonify({
            "ok": True,
            "chain": chain_data,
            "length": len(blockchain.chain),
            "valid": blockchain.is_chain_valid(),
            "genesis_block": chain_data[0] if chain_data else None
        })

    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/blockchain/block/<int:index>", methods=["GET"])
def get_block(index):
    """Get a specific block by index"""
    try:
        if index < 0 or index >= len(blockchain.chain):
            return jsonify({
                "ok": False,
                "error": f"Block #{index} not found"
            }), 404

        block = blockchain.chain[index]

        return jsonify({
            "ok": True,
            "block": block.to_dict()
        })

    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/blockchain/wallet/create", methods=["POST"])
def create_wallet():
    """Create a new wallet"""
    try:
        data = request.get_json()
        name = data.get("name", f"wallet_{len(wallets)}")

        # Generate address (simplified - real crypto uses key pairs)
        address = hashlib.sha256(f"{name}{datetime.utcnow().isoformat()}".encode()).hexdigest()[:40]

        wallet = {
            "address": address,
            "created": datetime.utcnow().isoformat() + "Z",
            "name": name
        }

        wallets[name] = wallet

        return jsonify({
            "ok": True,
            "wallet": wallet,
            "message": f"Wallet '{name}' created"
        })

    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/blockchain/wallet/<address>/balance", methods=["GET"])
def get_balance(address):
    """Get wallet balance"""
    try:
        balance = blockchain.get_balance(address)

        return jsonify({
            "ok": True,
            "address": address,
            "balance": balance,
            "unit": "BRC"  # BlackRoad Coin!
        })

    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/blockchain/contract/deploy", methods=["POST"])
def deploy_contract():
    """Deploy a smart contract"""
    try:
        data = request.get_json()

        contract_code = data.get("code")
        contract_name = data.get("name")
        deployer = data.get("deployer")

        if not all([contract_code, contract_name, deployer]):
            return jsonify({
                "ok": False,
                "error": "Missing required fields: code, name, deployer"
            }), 400

        contract_address = hashlib.sha256(f"{contract_name}{datetime.utcnow().isoformat()}".encode()).hexdigest()[:40]

        contract = {
            "address": contract_address,
            "name": contract_name,
            "code": contract_code,
            "deployer": deployer,
            "deployed_at": datetime.utcnow().isoformat() + "Z"
        }

        smart_contracts[contract_address] = contract

        # Create deployment transaction
        blockchain.create_transaction(
            deployer,
            contract_address,
            0,
            f"Smart contract '{contract_name}' deployment"
        )

        return jsonify({
            "ok": True,
            "contract": contract,
            "message": f"Contract '{contract_name}' deployed"
        })

    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/blockchain/stats", methods=["GET"])
def get_stats():
    """Get blockchain statistics"""
    try:
        total_transactions = sum(len(block.transactions) for block in blockchain.chain)

        stats = {
            "blockchain_height": len(blockchain.chain),
            "total_transactions": total_transactions,
            "pending_transactions": len(blockchain.pending_transactions),
            "difficulty": blockchain.difficulty,
            "mining_reward": blockchain.mining_reward,
            "total_wallets": len(wallets),
            "total_contracts": len(smart_contracts),
            "chain_valid": blockchain.is_chain_valid(),
            "genesis_block": blockchain.chain[0].to_dict() if blockchain.chain else None,
            "latest_block": blockchain.get_latest_block().to_dict(),
            "satoshi_tribute": "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"
        }

        return jsonify({
            "ok": True,
            "stats": stats
        })

    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/blockchain/satoshi", methods=["GET"])
def satoshi_easter_egg():
    """
    Easter egg endpoint with Satoshi Nakamoto references

    Fun facts about Bitcoin and Satoshi:
    - Genesis block: Jan 3, 2009
    - First transaction: Block 170 to Hal Finney
    - Last known post: Dec 12, 2010
    - Bitcoin whitepaper: October 31, 2008
    """
    return jsonify({
        "ok": True,
        "message": "In memory of Satoshi Nakamoto, the anonymous creator of Bitcoin",
        "facts": {
            "genesis_block_date": "2009-01-03T18:15:05Z",
            "genesis_message": "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks",
            "first_bitcoin_address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
            "bitcoin_whitepaper_date": "2008-10-31",
            "whitepaper_title": "Bitcoin: A Peer-to-Peer Electronic Cash System",
            "first_transaction_recipient": "Hal Finney",
            "satoshi_last_post": "2010-12-12",
            "estimated_satoshi_holdings": "~1,000,000 BTC",
            "total_bitcoin_supply": "21,000,000 BTC"
        },
        "quote": "If you don't believe it or don't get it, I don't have the time to try to convince you, sorry. - Satoshi Nakamoto",
        "note": "No Satoshi accounts found here, but his legacy lives on in every blockchain! 🚀"
    })

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 9800))
    print(f"⛓️  BlackRoad Blockchain starting on port {port}...")
    print(f"📦 Genesis block created with Satoshi tribute")
    print(f"💰 Mining reward: {blockchain.mining_reward} BRC")
    print(f"⚙️  Difficulty: {blockchain.difficulty} leading zeros")
    app.run(host="0.0.0.0", port=port, debug=False)
