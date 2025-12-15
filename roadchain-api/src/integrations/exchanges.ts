/**
 * Exchange Integrations for RoadCoin
 * Supports CEX deposits/withdrawals and DEX liquidity
 */

import { ethers } from 'ethers';

export interface ExchangeConfig {
  name: string;
  type: 'CEX' | 'DEX';
  depositAddresses?: string[];
  withdrawalEnabled: boolean;
  minDeposit?: string; // in ROAD
  minWithdrawal?: string; // in ROAD
  confirmations: number;
}

export interface DepositEvent {
  txHash: string;
  from: string;
  to: string;
  amount: string; // in ROAD
  block: number;
  timestamp: number;
  confirmations: number;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface WithdrawalRequest {
  userId: string;
  address: string;
  amount: string; // in ROAD
  memo?: string;
}

export class ExchangeIntegration {
  private provider: ethers.JsonRpcProvider;
  private wallet?: ethers.Wallet;
  private config: ExchangeConfig;

  constructor(config: ExchangeConfig, rpcUrl: string, privateKey?: string) {
    this.config = config;
    this.provider = new ethers.JsonRpcProvider(rpcUrl);

    if (privateKey) {
      this.wallet = new ethers.Wallet(privateKey, this.provider);
    }
  }

  /**
   * Generate new deposit address for user
   */
  async generateDepositAddress(): Promise<{ address: string; privateKey: string }> {
    const wallet = ethers.Wallet.createRandom();
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
    };
  }

  /**
   * Check balance of an address
   */
  async getBalance(address: string): Promise<string> {
    const balance = await this.provider.getBalance(address);
    return ethers.formatEther(balance);
  }

  /**
   * Monitor deposits for a specific address
   */
  async monitorDeposits(
    depositAddress: string,
    callback: (deposit: DepositEvent) => void
  ): Promise<void> {
    const filter = {
      address: null,
      topics: [
        null,
        null,
        ethers.zeroPadValue(depositAddress, 32), // to address
      ],
    };

    this.provider.on(filter, async (log) => {
      const tx = await this.provider.getTransaction(log.transactionHash);
      const receipt = await this.provider.getTransactionReceipt(log.transactionHash);

      if (!tx || !receipt) return;

      const currentBlock = await this.provider.getBlockNumber();
      const confirmations = currentBlock - receipt.blockNumber;

      const deposit: DepositEvent = {
        txHash: tx.hash,
        from: tx.from,
        to: tx.to || '',
        amount: ethers.formatEther(tx.value),
        block: receipt.blockNumber,
        timestamp: Date.now(),
        confirmations,
        status: confirmations >= this.config.confirmations ? 'confirmed' : 'pending',
      };

      callback(deposit);
    });
  }

  /**
   * Process withdrawal to user address
   */
  async processWithdrawal(request: WithdrawalRequest): Promise<string> {
    if (!this.wallet) {
      throw new Error('Wallet not initialized for withdrawals');
    }

    if (!this.config.withdrawalEnabled) {
      throw new Error('Withdrawals not enabled for this exchange');
    }

    // Validate amount
    const amount = ethers.parseEther(request.amount);
    if (this.config.minWithdrawal) {
      const minAmount = ethers.parseEther(this.config.minWithdrawal);
      if (amount < minAmount) {
        throw new Error(`Minimum withdrawal is ${this.config.minWithdrawal} ROAD`);
      }
    }

    // Check balance
    const balance = await this.wallet.provider.getBalance(this.wallet.address);
    if (balance < amount) {
      throw new Error('Insufficient balance for withdrawal');
    }

    // Send transaction
    const tx = await this.wallet.sendTransaction({
      to: request.address,
      value: amount,
      gasLimit: 21000,
    });

    await tx.wait(this.config.confirmations);

    return tx.hash;
  }

  /**
   * Get transaction details
   */
  async getTransaction(txHash: string): Promise<any> {
    const [tx, receipt] = await Promise.all([
      this.provider.getTransaction(txHash),
      this.provider.getTransactionReceipt(txHash),
    ]);

    if (!tx) {
      throw new Error('Transaction not found');
    }

    const currentBlock = await this.provider.getBlockNumber();
    const confirmations = receipt ? currentBlock - receipt.blockNumber : 0;

    return {
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: ethers.formatEther(tx.value),
      gasPrice: tx.gasPrice?.toString(),
      gasUsed: receipt?.gasUsed?.toString(),
      blockNumber: receipt?.blockNumber,
      confirmations,
      status: receipt?.status === 1 ? 'success' : 'failed',
      timestamp: receipt ? (await this.provider.getBlock(receipt.blockNumber))?.timestamp : null,
    };
  }

  /**
   * Batch check balances for multiple addresses
   */
  async batchGetBalances(addresses: string[]): Promise<Map<string, string>> {
    const balances = new Map<string, string>();

    const promises = addresses.map(async (address) => {
      const balance = await this.getBalance(address);
      return { address, balance };
    });

    const results = await Promise.all(promises);

    results.forEach(({ address, balance }) => {
      balances.set(address, balance);
    });

    return balances;
  }

  /**
   * Get deposit history for address
   */
  async getDepositHistory(
    address: string,
    fromBlock: number = 0,
    toBlock: number | string = 'latest'
  ): Promise<DepositEvent[]> {
    const filter = {
      address: null,
      topics: [
        null,
        null,
        ethers.zeroPadValue(address, 32),
      ],
      fromBlock,
      toBlock,
    };

    const logs = await this.provider.getLogs(filter);
    const deposits: DepositEvent[] = [];

    for (const log of logs) {
      const tx = await this.provider.getTransaction(log.transactionHash);
      const receipt = await this.provider.getTransactionReceipt(log.transactionHash);
      const currentBlock = await this.provider.getBlockNumber();

      if (!tx || !receipt) continue;

      deposits.push({
        txHash: tx.hash,
        from: tx.from,
        to: tx.to || '',
        amount: ethers.formatEther(tx.value),
        block: receipt.blockNumber,
        timestamp: (await this.provider.getBlock(receipt.blockNumber))?.timestamp || 0,
        confirmations: currentBlock - receipt.blockNumber,
        status: 'confirmed',
      });
    }

    return deposits;
  }
}

/**
 * Pre-configured exchange integrations
 */
export const EXCHANGES: Record<string, ExchangeConfig> = {
  binance: {
    name: 'Binance',
    type: 'CEX',
    withdrawalEnabled: true,
    minDeposit: '10',
    minWithdrawal: '20',
    confirmations: 12,
  },
  coinbase: {
    name: 'Coinbase',
    type: 'CEX',
    withdrawalEnabled: true,
    minDeposit: '1',
    minWithdrawal: '1',
    confirmations: 35,
  },
  kraken: {
    name: 'Kraken',
    type: 'CEX',
    withdrawalEnabled: true,
    minDeposit: '5',
    minWithdrawal: '10',
    confirmations: 20,
  },
  gateio: {
    name: 'Gate.io',
    type: 'CEX',
    withdrawalEnabled: true,
    minDeposit: '1',
    minWithdrawal: '5',
    confirmations: 12,
  },
  uniswap: {
    name: 'Uniswap',
    type: 'DEX',
    withdrawalEnabled: false,
    confirmations: 2,
  },
};

/**
 * Helper: Create exchange integration
 */
export function createExchangeIntegration(
  exchangeName: keyof typeof EXCHANGES,
  rpcUrl: string,
  privateKey?: string
): ExchangeIntegration {
  const config = EXCHANGES[exchangeName];
  if (!config) {
    throw new Error(`Unknown exchange: ${exchangeName}`);
  }

  return new ExchangeIntegration(config, rpcUrl, privateKey);
}
