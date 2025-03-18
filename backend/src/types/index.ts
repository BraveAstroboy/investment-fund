// Fund metrics types
export interface FundMetrics {
  totalAssetValue: string;
  sharesSupply: string;
  sharePrice: string;
  lastUpdateTime: number;
  blockNumber: string;
  createdAt: Date;
}

// Investment types
export interface Investment {
  id: string;
  investorAddress: string;
  usdAmount: string;
  sharesIssued: string;
  sharePrice: string;
  transactionHash?: string;
  status: InvestmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum InvestmentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

// Redemption types
export interface Redemption {
  id: string;
  investorAddress: string;
  shares: string;
  usdAmount: string;
  sharePrice: string;
  transactionHash?: string;
  status: RedemptionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum RedemptionStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

// Smart contract event types
export interface InvestmentEvent {
  investor: string;
  usdAmount: string;
  sharesIssued: string;
  sharePrice: string;
}

export interface RedemptionEvent {
  investor: string;
  shares: string;
  usdAmount: string;
  sharePrice: string;
}

export interface MetricsUpdatedEvent {
  totalAssetValue: string;
  sharesSupply: string;
  sharePrice: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ErrorResponse {
  error: string;
  message: string;
}

// Request types
export interface InvestRequest {
  investor: string;
  usdAmount: string;
}

export interface RedeemRequest {
  investor: string;
  shares: string;
} 