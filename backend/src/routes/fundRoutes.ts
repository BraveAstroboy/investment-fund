import { Router } from 'express';
import { body } from 'express-validator';
import FundController from '../controllers/FundController';
import { validationMiddleware } from '../middlewares/validationMiddleware';

const router = Router();

// Apply API key auth to all routes in this router
// router.use(apiKeyAuth); // Uncomment when ready for production

// Investment route
router.post(
  '/invest',
  [
    body('investor')
      .isString()
      .isLength({ min: 42, max: 42 })
      .withMessage('Valid Ethereum address is required'),
    body('usdAmount')
      .isString()
      .withMessage('USD amount must be a string')
      .custom((value) => {
        if (!/^\d+(\.\d+)?$/.test(value)) {
          throw new Error('USD amount must be a valid number string');
        }
        return true;
      }),
    validationMiddleware
  ],
  FundController.invest
);

// Redemption route
router.post(
  '/redeem',
  [
    body('investor')
      .isString()
      .isLength({ min: 42, max: 42 })
      .withMessage('Valid Ethereum address is required'),
    body('shares')
      .isString()
      .withMessage('Shares amount must be a string')
      .custom((value) => {
        if (!/^\d+(\.\d+)?$/.test(value)) {
          throw new Error('Shares amount must be a valid number string');
        }
        return true;
      }),
    validationMiddleware
  ],
  FundController.redeem
);

// Fund metrics route
router.get('/metrics', FundController.getFundMetrics);

// Investor balance route
router.get(
  '/balance/:investor',
  FundController.getInvestorBalance
);

// Investment history route
router.get(
  '/history/:investor',
  FundController.getInvestorHistory
);

export default router; 