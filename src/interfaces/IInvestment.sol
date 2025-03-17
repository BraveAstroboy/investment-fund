// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

interface IInvestment {
    struct FundMetrics {
        uint256 totalAssetValue; // Total fund value in USD (6 decimals)
        uint256 sharesSupply; // Total supply of shares
        uint256 lastUpdateTime; // Last update timestamp
    }

    // Core Operations
    function invest(address investor, uint256 usdAmount) external returns (uint256 sharesIssued);
    function redeem(address investor, uint256 shares) external returns (uint256 usdAmount);

    // View Functions
    function getFundMetrics() external view returns (FundMetrics memory);
    function getSharePrice() external view returns (uint256);
    function balanceOf(address investor) external view returns (uint256);

    // Events
    event Investment(address indexed investor, uint256 usdAmount, uint256 sharesIssued, uint256 sharePrice);
    event Redemption(address indexed investor, uint256 shares, uint256 usdAmount, uint256 sharePrice);
    event MetricsUpdated(uint256 totalAssetValue, uint256 sharesSupply, uint256 sharePrice);

    // Errors
    error TransferFailed();
}
