// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "../standards/ERC1155/ERC1155G.sol";

contract MockERC1155G is ERC1155G("") {
    function mintBatch(
        address to,
        uint256[] calldata tokenIds,
        uint256[] calldata amounts,
        bytes calldata data
    ) external override {
        _mintBatch(to, tokenIds, amounts, data);
    }

    function burnBatch(
        address from,
        uint256[] calldata tokenIds,
        uint256[] calldata amounts
    ) external override {
        require(from == msg.sender || isApprovedForAll(from, msg.sender), "UNAUTHORIZED");
        _burnBatch(from, tokenIds, amounts);
    }
}
