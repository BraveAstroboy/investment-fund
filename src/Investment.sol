// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.25;

import "./interfaces/IInvestment.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Investment is IInvestment {
    using SafeERC20 for IERC20;

    FundMetrics public fundMetrics;
    mapping(address => uint256) public balanceOf;
    IERC20 public asset;

    constructor(address _asset) {
        asset = IERC20(_asset);
        fundMetrics = FundMetrics({totalAssetValue: 0, sharesSupply: 0, lastUpdateTime: block.timestamp});
    }

    function invest(address investor, uint256 usdAmount) external returns (uint256 sharesIssued) {
        fundMetrics.totalAssetValue = asset.balanceOf(address(this));
        asset.safeTransferFrom(msg.sender, address(this), usdAmount);
        if (fundMetrics.totalAssetValue == 0) {
            sharesIssued = usdAmount;
        } else {
            sharesIssued = usdAmount * fundMetrics.sharesSupply / fundMetrics.totalAssetValue;
        }
        balanceOf[investor] += sharesIssued;

        fundMetrics.totalAssetValue += usdAmount;
        fundMetrics.sharesSupply += sharesIssued;
        fundMetrics.lastUpdateTime = block.timestamp;

        uint256 newSharePrice = 0;
        if (fundMetrics.sharesSupply > 0) {
            newSharePrice = fundMetrics.totalAssetValue / fundMetrics.sharesSupply;
        }

        emit Investment(investor, usdAmount, sharesIssued, newSharePrice);
        emit MetricsUpdated(fundMetrics.totalAssetValue, fundMetrics.sharesSupply, newSharePrice);
    }

    function redeem(address investor, uint256 shares) external returns (uint256 usdAmount) {
        fundMetrics.totalAssetValue = asset.balanceOf(address(this));
        balanceOf[investor] -= shares;
        usdAmount = shares * fundMetrics.totalAssetValue / fundMetrics.sharesSupply;
        asset.safeTransfer(investor, usdAmount);

        fundMetrics.totalAssetValue -= usdAmount;
        fundMetrics.sharesSupply -= shares;
        fundMetrics.lastUpdateTime = block.timestamp;

        uint256 newSharePrice = 0;
        if (fundMetrics.sharesSupply > 0) {
            newSharePrice = fundMetrics.totalAssetValue / fundMetrics.sharesSupply;
        }

        emit Redemption(investor, shares, usdAmount, newSharePrice);
        emit MetricsUpdated(fundMetrics.totalAssetValue, fundMetrics.sharesSupply, newSharePrice);
    }

    function getFundMetrics() external view returns (FundMetrics memory) {
        return fundMetrics;
    }

    function getSharePrice() external view returns (uint256) {
        uint256 newSharePrice = 0;
        if (fundMetrics.sharesSupply > 0) {
            newSharePrice = fundMetrics.totalAssetValue / fundMetrics.sharesSupply;
        }
        return newSharePrice;
    }
}
