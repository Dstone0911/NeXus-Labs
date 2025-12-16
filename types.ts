export enum Token {
  SEPOLIA_ETH = 'Sepolia ETH',
  GOERLI_ETH = 'Goerli ETH',
  MUMBAI_MATIC = 'Mumbai MATIC',
  SOL_DEVNET = 'Solana Devnet',
  BASE_SEPOLIA = 'Base Sepolia'
}

export interface BridgeResult {
  success: boolean;
  yieldAmount: number;
  story: string;
  transmutationType: string;
}

export interface Transaction {
  id: string;
  timestamp: number;
  inputToken: Token;
  inputAmount: number;
  outputAmount: number; 
  story: string;
  type: string;
}

export interface WalletState {
  [key: string]: number;
}

export interface MarketData {
  headlines: string[];
  goldPrice: number;
  marketTrend: 'bullish' | 'bearish' | 'chaotic';
}

export interface StakingInfo {
  apy: number;
  reason: string;
}

// Add global declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}