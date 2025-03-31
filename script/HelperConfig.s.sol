// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {MockV3Aggregator} from "../test/mocks/MockV3Aggregator.sol";

contract HelperConfig is Script {
    // if we are on a loca anvil, we deploy mocks
    // Otherwise, grab the existing address from the network

    address public constant priceFeedMainnetAddress =
        0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419;
    address public constant priceFeedSepoliaAddress =
        0x694AA1769357215DE4FAC081bf1f309aDC325306;

    uint8 public constant DECIMALS = 8;
    int256 public constant INITIAL_PRICE = 2000 * 10 ** 8;

    NetworkConfig public activeNetworkConfig;

    constructor() {
        if (block.chainid == 1) {
            activeNetworkConfig = getMainnetEthConfig();
        } else if (block.chainid == 11155111) {
            activeNetworkConfig = getSepoliaEthConfig();
        } else {
            // anvil local network
            activeNetworkConfig = getOrCreateAnvilEthConfig();
        }
    }

    // now we only have one address, but we can have more, so we can use a struct
    struct NetworkConfig {
        address priceFeed;
        address otherTestAddress;
    }

    function getMainnetEthConfig() public pure returns (NetworkConfig memory) {
        NetworkConfig memory config;
        config.priceFeed = priceFeedMainnetAddress;
        return config;
    }

    function getSepoliaEthConfig() public pure returns (NetworkConfig memory) {
        NetworkConfig memory config;
        config.priceFeed = priceFeedSepoliaAddress;
        return config;
    }

    function getOrCreateAnvilEthConfig() public returns (NetworkConfig memory) {
        if (activeNetworkConfig.priceFeed != address(0)) {
            return activeNetworkConfig;
        }
        // 1. Deploy the mocks
        // 2. Return the mock address

        vm.startBroadcast();
        MockV3Aggregator mockPriceFeed = new MockV3Aggregator(
            DECIMALS,
            INITIAL_PRICE
        );
        vm.stopBroadcast();

        NetworkConfig memory anvilConfig;
        anvilConfig.priceFeed = address(mockPriceFeed);

        return anvilConfig;
    }
}
