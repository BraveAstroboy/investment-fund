// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.25;

import {Script, console} from "forge-std/Script.sol";
import {Investment} from "../src/Investment.sol";
import {MockERC20} from "../test/mocks/MockERC20.sol";

contract InvestmentScript is Script {
    Investment public investment;
    MockERC20 public asset;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        asset = new MockERC20("Investment Asset", "IA");
        investment = new Investment(address(asset));

        vm.stopBroadcast();
    }
}
