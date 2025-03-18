import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import FundService from '../services/FundService';

export class FundController {
    async invest(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { investor, usdAmount } = req.body;
            const result = await FundService.invest(investor, usdAmount);
            return res.status(201).json(result);
        } catch (error: any) {
            console.error('Investment controller error:', error);
            return res.status(500).json({ 
                error: 'Investment failed',
                message: error.message 
            });
        }
    }

    async redeem(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { investor, shares } = req.body;
            const result = await FundService.redeem(investor, shares);
            return res.status(201).json(result);
        } catch (error: any) {
            console.error('Redemption controller error:', error);
            return res.status(500).json({ 
                error: 'Redemption failed',
                message: error.message 
            });
        }
    }

    async getFundMetrics(_req: Request, res: Response) {
        try {
            const metrics = await FundService.getFundMetrics();
            return res.json(metrics);
        } catch (error: any) {
            console.error('Get fund metrics error:', error);
            return res.status(500).json({ 
                error: 'Failed to get fund metrics',
                message: error.message 
            });
        }
    }

    async getInvestorBalance(req: Request, res: Response) {
        try {
            const { investor } = req.params;
            const balance = await FundService.getInvestorBalance(investor);
            return res.json({ balance });
        } catch (error: any) {
            console.error('Get investor balance error:', error);
            return res.status(500).json({ 
                error: 'Failed to get investor balance',
                message: error.message 
            });
        }
    }

    async getInvestorHistory(req: Request, res: Response) {
        try {
            const { investor } = req.params;
            const history = await FundService.getInvestorHistory(investor);
            return res.json(history);
        } catch (error: any) {
            console.error('Get investor history error:', error);
            return res.status(500).json({ 
                error: 'Failed to get investor history',
                message: error.message 
            });
        }
    }
}

export default new FundController(); 