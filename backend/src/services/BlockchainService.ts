import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

const isDev = process.env.NODE_ENV !== 'production';

class BlockchainService {
    private provider: ethers.JsonRpcProvider;
    private contract: ethers.Contract | null = null;
    private wallet: ethers.Wallet | null = null;
    private isInitialized = false;

    constructor() {
        try {
            // Check if we have the required blockchain config
            const rpcUrl = process.env.BLOCKCHAIN_RPC_URL;
            const privateKey = process.env.PRIVATE_KEY;
            const contractAddress = process.env.CONTRACT_ADDRESS;
            
            if (!rpcUrl || rpcUrl.includes('your') || !contractAddress || contractAddress.includes('your')) {
                if (isDev) {
                    logger.warn('Blockchain service running in mock mode due to missing configuration');
                    this.isInitialized = false;
                    return;
                } else {
                    throw new Error('Missing required blockchain configuration');
                }
            }

            this.provider = new ethers.JsonRpcProvider(rpcUrl);

            // Only initialize wallet if private key is valid
            if (privateKey && !privateKey.includes('your_private_key')) {
                this.wallet = new ethers.Wallet(privateKey, this.provider);
            } else if (isDev) {
                // In dev, create a random wallet for testing
                const randomWallet = ethers.Wallet.createRandom();
                this.wallet = new ethers.Wallet(randomWallet.privateKey, this.provider);
                logger.warn('Using a random wallet in development mode');
            } else {
                throw new Error('Invalid or missing private key');
            }
            
            // Contract ABI will be imported from a separate file
            const contractABI = require('../abi/Investment.json');
            this.contract = new ethers.Contract(
                contractAddress,
                contractABI,
                this.wallet
            );
            
            this.isInitialized = true;
            logger.info('BlockchainService initialized successfully');
        } catch (error) {
            logger.error('Failed to initialize BlockchainService', error);
            if (!isDev) throw error;
            this.isInitialized = false;
        }
    }

    // Helper to check if we're initialized
    private checkInitialized() {
        if (!this.isInitialized) {
            if (isDev) {
                // In dev, return mock data
                logger.warn('Blockchain service called in mock mode');
                return false;
            } else {
                throw new Error('BlockchainService not properly initialized');
            }
        }
        return true;
    }

    async invest(investor: string, usdAmount: string): Promise<any> {
        try {
            if (!this.checkInitialized()) {
                // Return mock data in dev mode
                return {
                    hash: `mock_tx_${Date.now()}`,
                    logs: [{ 
                        eventName: 'Investment',
                        args: { 
                            sharesIssued: usdAmount, 
                            sharePrice: "1000000" 
                        }
                    }]
                };
            }

            const tx = await this.contract!.invest(investor, usdAmount);
            const receipt = await tx.wait();
            return receipt;
        } catch (error) {
            logger.error('Investment transaction failed:', error);
            throw error;
        }
    }

    async redeem(investor: string, shares: string): Promise<any> {
        try {
            if (!this.checkInitialized()) {
                // Return mock data in dev mode
                return {
                    hash: `mock_tx_${Date.now()}`,
                    logs: [{ 
                        eventName: 'Redemption',
                        args: { 
                            usdAmount: shares, 
                            sharePrice: "1000000" 
                        }
                    }]
                };
            }

            const tx = await this.contract!.redeem(investor, shares);
            const receipt = await tx.wait();
            return receipt;
        } catch (error) {
            logger.error('Redemption transaction failed:', error);
            throw error;
        }
    }

    async getFundMetrics(): Promise<any> {
        try {
            if (!this.checkInitialized()) {
                // Return mock data in dev mode
                return {
                    totalAssetValue: "1000000000",
                    sharesSupply: "1000000",
                    sharePrice: "1000",
                    lastUpdateTime: Math.floor(Date.now() / 1000).toString()
                };
            }

            const metrics = await this.contract!.getFundMetrics();
            const sharePrice = await this.getSharePrice();
            
            return {
                totalAssetValue: metrics.totalAssetValue.toString(),
                sharesSupply: metrics.sharesSupply.toString(),
                sharePrice: sharePrice,
                lastUpdateTime: metrics.lastUpdateTime.toString()
            };
        } catch (error) {
            logger.error('Failed to fetch fund metrics:', error);
            throw error;
        }
    }

    async getSharePrice(): Promise<string> {
        try {
            if (!this.checkInitialized()) {
                // Return mock data in dev mode
                return "1000000";
            }

            const sharePrice = await this.contract!.getSharePrice();
            return sharePrice.toString();
        } catch (error) {
            logger.error('Failed to fetch share price:', error);
            throw error;
        }
    }

    async getBalance(investor: string): Promise<string> {
        try {
            if (!this.checkInitialized()) {
                // Return mock data in dev mode
                return "5000000";
            }

            const balance = await this.contract!.balanceOf(investor);
            return balance.toString();
        } catch (error) {
            logger.error('Failed to fetch balance:', error);
            throw error;
        }
    }
}

export default new BlockchainService(); 