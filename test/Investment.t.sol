// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.25;

import {Test, console} from "forge-std/Test.sol";
import {Investment} from "../src/Investment.sol";
import {MockERC20} from "./mocks/MockERC20.sol";

contract InvestmentTest is Test {
    Investment public investment;
    MockERC20 public asset;
    address public investor = makeAddr("investor");

    function setUp() public {
        vm.startPrank(investor);
        asset = new MockERC20("MockERC20", "MCK");
        investment = new Investment(address(asset));
        asset.mint(investor, 10000);
        asset.approve(address(investment), 10000);
        vm.stopPrank();
    }

    function test_Invest() public {
        vm.startPrank(investor);
        investment.invest(investor, 1000);
        assertEq(investment.balanceOf(investor), 1000);
        assertEq(investment.getFundMetrics().totalAssetValue, 1000);
        assertEq(investment.getFundMetrics().sharesSupply, 1000);
        assertEq(investment.getSharePrice(), 1);

        asset.transfer(address(investment), 1000);
        investment.invest(investor, 0);
        assertEq(investment.getFundMetrics().totalAssetValue, 2000);
        assertEq(investment.getFundMetrics().sharesSupply, 1000);
        assertEq(investment.getSharePrice(), 2);
        vm.stopPrank();
    }

    function test_Redeem() public {
        vm.startPrank(investor);
        investment.invest(investor, 1000);
        investment.redeem(investor, 1000);
        assertEq(investment.balanceOf(investor), 0);
        assertEq(investment.getFundMetrics().totalAssetValue, 0);
        assertEq(investment.getFundMetrics().sharesSupply, 0);
        vm.stopPrank();
    }
}
