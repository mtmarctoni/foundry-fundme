// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {PriceConverter} from "../src/PriceConverter.sol";

contract PriceConverterScript is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        console.log("Hello library");

        vm.stopBroadcast();
    }
}
