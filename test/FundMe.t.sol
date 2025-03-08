// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import {Test, console} from "forge-std/Test.sol";
import {FundMe} from "../src/FundMe.sol";
import {DeployFundMe} from "../script/FundMe.s.sol";

contract FundMeTest is Test {
    uint256 favNumber = 0;
    bool greatCourse = false;

    DeployFundMe public deployFundMe;
    FundMe fundMe;

    address USER = makeAddr("userName");
    uint256 constant STARTING_BALANCE = 100 ether;
    uint256 constant SEND_VALUE = 1 ether;
    uint256 constant GAS_PRICE = 1;

    function setUp() external {
        favNumber = 73;
        greatCourse = true;

        deployFundMe = new DeployFundMe();
        fundMe = deployFundMe.run();
        vm.deal(USER, STARTING_BALANCE);
    }

    function testDemo() public view {
        console.log("Hello testing with Solidity");
        assertEq(favNumber, 73);
        assertEq(greatCourse, true);
    }

    modifier fundFromUser() {
        vm.prank(USER);
        fundMe.fund{value: SEND_VALUE}();
        _;
    }

    function testOwnerIsMsgSender() public view {
        // ya no es este contrato, sino el contrato que lo despliega ARREGLAR
        console.log("Owner is ", fundMe.getOwner());
        console.log("DeployFundMe is ", address(deployFundMe));
        console.log("This contract address is ", address(this));
        console.log("msg.sender address is ", msg.sender);
        assertEq(fundMe.getOwner(), msg.sender);
    }

    function testMinimumDolar() public view {
        console.log("Minimum USD is ", fundMe.MINIMUM_USD());
        assertEq(fundMe.MINIMUM_USD(), 5 * 10 ** 18);
    }

    function testPriceFeedVersionIsAccurate() public view {
        uint256 version = fundMe.getVersion();
        assertEq(version, 4);
    }

    function testFundFailsWithoutMinimumUSD() public {
        vm.expectRevert();
        fundMe.fund{value: 0 ether}();
    }

    function testFundUpdatesFundedDataSructure() public fundFromUser {
        assertEq(fundMe.getAddressToAmountFunded(USER), SEND_VALUE);
    }

    function testAddsFunderToArrayOfFunders() public fundFromUser {
        address funder = fundMe.getFunder(0);
        assertEq(funder, USER);
    }

    function testOnlyOwnerCanWithdraw() public fundFromUser {
        vm.prank(USER);
        vm.expectRevert();
        fundMe.withdraw();
    }

    function testWithdrawWithgASingleFunder() public fundFromUser {
        uint256 initialOwnerBalance = fundMe.getOwner().balance;

        uint256 startGas = gasleft();
        vm.txGasPrice(GAS_PRICE);
        vm.prank(fundMe.getOwner());
        fundMe.withdraw();
        uint256 usedGas = (startGas - gasleft()) * tx.gasprice;
        // it seems gas is not taking into account
        console.log("Used gas: ", usedGas);
        console.log(STARTING_BALANCE - USER.balance);
        console.log(fundMe.getOwner().balance - initialOwnerBalance);

        assertEq(fundMe.getAddressToAmountFunded(USER), 0);
        assertEq(USER.balance, STARTING_BALANCE - SEND_VALUE);
        // assertEq(USER.balance, STARTING_BALANCE - SEND_VALUE - usedGas);
        assertEq(fundMe.getOwner().balance, initialOwnerBalance + SEND_VALUE);
    }

    function testWithdrawWithMultipleFunders() public fundFromUser {
        uint160 numberOfFunders = 10;

        for (uint160 i = 1; i < numberOfFunders; i++) {
            hoax(address(i), STARTING_BALANCE);
            fundMe.fund{value: SEND_VALUE}();
        }

        uint256 initialOwnerBalance = fundMe.getOwner().balance;
        uint256 initialFundMeBalance = address(fundMe).balance;

        vm.prank(fundMe.getOwner());
        fundMe.withdraw();

        assertEq(address(fundMe).balance, 0);
        for (uint160 i = 1; i < numberOfFunders; i++) {
            assertEq(fundMe.getAddressToAmountFunded(address(i)), 0);
        }
        assertEq(
            fundMe.getOwner().balance,
            initialOwnerBalance + numberOfFunders * SEND_VALUE
        );
        assertEq(
            fundMe.getOwner().balance,
            initialOwnerBalance + initialFundMeBalance
        );
    }

    function testCheaperWithdrawWithMultipleFunders() public fundFromUser {
        uint160 numberOfFunders = 10;

        for (uint160 i = 1; i < numberOfFunders; i++) {
            hoax(address(i), STARTING_BALANCE);
            fundMe.fund{value: SEND_VALUE}();
        }

        uint256 initialOwnerBalance = fundMe.getOwner().balance;
        uint256 initialFundMeBalance = address(fundMe).balance;

        vm.prank(fundMe.getOwner());
        fundMe.cheaperWithdraw();

        assertEq(address(fundMe).balance, 0);
        for (uint160 i = 1; i < numberOfFunders; i++) {
            assertEq(fundMe.getAddressToAmountFunded(address(i)), 0);
        }
        assertEq(
            fundMe.getOwner().balance,
            initialOwnerBalance + numberOfFunders * SEND_VALUE
        );
        assertEq(
            fundMe.getOwner().balance,
            initialOwnerBalance + initialFundMeBalance
        );
    }
}
