import BlockchainService from './BlockchainService';
import DatabaseService from './DatabaseService';
import CacheService from './CacheService';

class FundService {
    async invest(investor: string, usdAmount: string) {
        try {
            // Create pending investment record
            const investment = await DatabaseService.saveInvestment({
                investorAddress: investor,
                usdAmount,
                status: 'PENDING',
                sharesIssued: '0',
                sharePrice: '0',
            });

            // Execute blockchain transaction
            const receipt = await BlockchainService.invest(investor, usdAmount);
            
            // Parse event logs to get shares issued and share price
            const investmentEvent = receipt.logs.find((log: any) => 
                log.eventName === 'Investment'
            );

            if (!investmentEvent) {
                throw new Error('Investment event not found in transaction logs');
            }

            const { sharesIssued, sharePrice } = investmentEvent.args;

            // Update investment record
            await DatabaseService.updateInvestmentStatus(investment.id, 'COMPLETED');
            await DatabaseService.saveInvestment({
                ...investment,
                sharesIssued: sharesIssued.toString(),
                sharePrice: sharePrice.toString(),
                transactionHash: receipt.hash,
                status: 'COMPLETED'
            });

            // Invalidate metrics cache
            await CacheService.invalidateMetrics();

            // Get and cache new metrics
            const metrics = await BlockchainService.getFundMetrics();
            await CacheService.setFundMetrics(metrics);

            return {
                investmentId: investment.id,
                transactionHash: receipt.hash,
                sharesIssued: sharesIssued.toString(),
                sharePrice: sharePrice.toString()
            };
        } catch (error) {
            console.error('Investment failed:', error);
            throw error;
        }
    }

    async redeem(investor: string, shares: string) {
        try {
            // Create pending redemption record
            const redemption = await DatabaseService.saveRedemption({
                investorAddress: investor,
                shares,
                status: 'PENDING',
                usdAmount: '0',
                sharePrice: '0',
            });

            // Execute blockchain transaction
            const receipt = await BlockchainService.redeem(investor, shares);
            
            // Parse event logs to get USD amount and share price
            const redemptionEvent = receipt.logs.find((log: any) => 
                log.eventName === 'Redemption'
            );

            if (!redemptionEvent) {
                throw new Error('Redemption event not found in transaction logs');
            }

            const { usdAmount, sharePrice } = redemptionEvent.args;

            // Update redemption record
            await DatabaseService.updateRedemptionStatus(redemption.id, 'COMPLETED');
            await DatabaseService.saveRedemption({
                ...redemption,
                usdAmount: usdAmount.toString(),
                sharePrice: sharePrice.toString(),
                transactionHash: receipt.hash,
                status: 'COMPLETED'
            });

            // Invalidate metrics cache
            await CacheService.invalidateMetrics();

            // Get and cache new metrics
            const metrics = await BlockchainService.getFundMetrics();
            await CacheService.setFundMetrics(metrics);

            return {
                redemptionId: redemption.id,
                transactionHash: receipt.hash,
                usdAmount: usdAmount.toString(),
                sharePrice: sharePrice.toString()
            };
        } catch (error) {
            console.error('Redemption failed:', error);
            throw error;
        }
    }

    async getFundMetrics() {
        try {
            // Try to get metrics from cache
            let metrics = await CacheService.getFundMetrics();
            
            if (!metrics) {
                // If not in cache, get from blockchain
                metrics = await BlockchainService.getFundMetrics();
                // Cache the metrics
                await CacheService.setFundMetrics(metrics);
            }

            return metrics;
        } catch (error) {
            console.error('Failed to get fund metrics:', error);
            throw error;
        }
    }

    async getInvestorBalance(investor: string) {
        try {
            const balance = await BlockchainService.getBalance(investor);
            return balance;
        } catch (error) {
            console.error('Failed to get investor balance:', error);
            throw error;
        }
    }

    async getInvestorHistory(investor: string) {
        try {
            const [investments, redemptions] = await Promise.all([
                DatabaseService.getInvestmentsByInvestor(investor),
                DatabaseService.getRedemptionsByInvestor(investor)
            ]);

            return {
                investments,
                redemptions
            };
        } catch (error) {
            console.error('Failed to get investor history:', error);
            throw error;
        }
    }
}

export default new FundService(); 