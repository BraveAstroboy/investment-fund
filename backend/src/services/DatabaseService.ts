import { AppDataSource } from '../config/database';
import { Investment } from '../entities/Investment';
import { Redemption } from '../entities/Redemption';
import { FundMetrics } from '../entities/FundMetrics';

class DatabaseService {
    async saveInvestment(investmentData: Partial<Investment>): Promise<Investment> {
        const investmentRepository = AppDataSource.getRepository(Investment);
        const investment = investmentRepository.create(investmentData);
        return await investmentRepository.save(investment);
    }

    async saveRedemption(redemptionData: Partial<Redemption>): Promise<Redemption> {
        const redemptionRepository = AppDataSource.getRepository(Redemption);
        const redemption = redemptionRepository.create(redemptionData);
        return await redemptionRepository.save(redemption);
    }

    async saveFundMetrics(metricsData: Partial<FundMetrics>): Promise<FundMetrics> {
        const metricsRepository = AppDataSource.getRepository(FundMetrics);
        const metrics = metricsRepository.create(metricsData);
        return await metricsRepository.save(metrics);
    }

    async getInvestmentsByInvestor(investorAddress: string): Promise<Investment[]> {
        const investmentRepository = AppDataSource.getRepository(Investment);
        return await investmentRepository.find({
            where: { investorAddress },
            order: { createdAt: 'DESC' }
        });
    }

    async getRedemptionsByInvestor(investorAddress: string): Promise<Redemption[]> {
        const redemptionRepository = AppDataSource.getRepository(Redemption);
        return await redemptionRepository.find({
            where: { investorAddress },
            order: { createdAt: 'DESC' }
        });
    }

    async getLatestFundMetrics(): Promise<FundMetrics | null> {
        const metricsRepository = AppDataSource.getRepository(FundMetrics);
        return await metricsRepository.findOne({
            order: { createdAt: 'DESC' }
        });
    }

    async updateInvestmentStatus(id: string, status: 'PENDING' | 'COMPLETED' | 'FAILED'): Promise<void> {
        const investmentRepository = AppDataSource.getRepository(Investment);
        await investmentRepository.update(id, { status });
    }

    async updateRedemptionStatus(id: string, status: 'PENDING' | 'COMPLETED' | 'FAILED'): Promise<void> {
        const redemptionRepository = AppDataSource.getRepository(Redemption);
        await redemptionRepository.update(id, { status });
    }
}

export default new DatabaseService(); 