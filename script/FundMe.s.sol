// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {HelperConfig} from "./HelperConfig.s.sol";
import {FundMe} from "../src/FundMe.sol";

contract DeployFundMe is Script {
    // address public sepoliaAddress = 0x694AA1769357215DE4FAC081bf1f309aDC325306;

    function setUp() public {}

    function run() public returns (FundMe) {
        (address priceFeed, ) = new HelperConfig().activeNetworkConfig();

        vm.startBroadcast();

        FundMe fundMe = new FundMe(priceFeed);

        vm.stopBroadcast();

        return fundMe;
    }
}
