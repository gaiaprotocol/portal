// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "../standards/ERC721/ERC721G.sol";

contract MockERC721G is ERC721G("Mock", "MOCK", "") {
    function mintBatch(address to, uint256[] calldata tokenIds) external override {
        _mintBatch(to, tokenIds);
    }

    function burnBatch(address from, uint256[] calldata tokenIds) external override {
        _burnBatch(from, tokenIds);
    }

    event BatchTransferFrom();

    function batchTransferFrom(
        address from,
        address to,
        uint256[] calldata tokenIds
    ) external override {
        _batchTransferFrom(from, to, tokenIds);
        emit BatchTransferFrom();
    }
}
