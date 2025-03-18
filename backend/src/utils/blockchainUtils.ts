import { ethers } from 'ethers';
import { logger } from './logger';

/**
 * Format a big number to a human-readable string with specified decimals
 */
export const formatBigNumber = (value: string, decimals = 18): string => {
  try {
    return ethers.formatUnits(value, decimals);
  } catch (error) {
    logger.error('Error formatting big number', { value, error });
    return '0';
  }
};

/**
 * Convert a number or string to a BigNumber with specified decimals
 */
export const toBigNumber = (value: string | number, decimals = 18): string => {
  try {
    return ethers.parseUnits(value.toString(), decimals).toString();
  } catch (error) {
    logger.error('Error converting to big number', { value, error });
    return '0';
  }
};

/**
 * Validate if a string is a valid Ethereum address
 */
export const isValidAddress = (address: string): boolean => {
  try {
    return ethers.isAddress(address);
  } catch (error) {
    return false;
  }
};

/**
 * Get a short readable form of an address
 */
export const shortenAddress = (address: string): string => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

/**
 * Generate a transaction link for a specific network
 */
export const getExplorerTxLink = (txHash: string, network = 'mainnet'): string => {
  const explorers: Record<string, string> = {
    mainnet: 'https://etherscan.io/tx/',
    goerli: 'https://goerli.etherscan.io/tx/',
    sepolia: 'https://sepolia.etherscan.io/tx/',
    // Add more networks as needed
  };

  const baseUrl = explorers[network] || explorers.mainnet;
  return `${baseUrl}${txHash}`;
}; 