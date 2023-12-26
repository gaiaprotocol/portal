// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/interfaces/IERC1155.sol";

interface IERC1155G is IERC1155 {
    event SetName(string name_);
    event SetSymbol(string symbol_);
    event SetBaseURI(string baseURI_);

    function exists(uint256 tokenId) external view returns (bool);

    function totalSupply(uint256 tokenId) external view returns (uint256);

    function setPause(bool status) external;

    function mint(
        address to,
        uint256 tokenId,
        uint256 amount,
        bytes memory data
    ) external;

    function mintBatch(
        address to,
        uint256[] calldata tokenIds,
        uint256[] memory amounts,
        bytes memory data
    ) external;

    function burn(
        address from,
        uint256 tokenId,
        uint256 amount
    ) external;

    function burnBatch(
        address from,
        uint256[] calldata tokenIds,
        uint256[] calldata amounts
    ) external;
}
