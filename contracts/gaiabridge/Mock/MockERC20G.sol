// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "../standards/ERC20/ERC20G.sol";

contract MockERC20G is ERC20G("Mock", "MOCK") {
    function mint(address to, uint256 amount) public override {
        _mint(to, amount);
    }

    function burnFrom(address from, uint256 amount) external override {
        _spendAllowance(from, msg.sender, amount);
        _burn(from, amount);
    }
}
