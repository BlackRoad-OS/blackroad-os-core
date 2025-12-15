// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/Upstream721.sol";

contract DeployUpstream721 is Script {
    function run() external {
        vm.startBroadcast();

        Upstream721 upstream721 = new Upstream721();

        console.log("Upstream721 deployed to:", address(upstream721));
        console.log("Total supply:", upstream721.totalSupply());

        vm.stopBroadcast();
    }
}
