// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "./IERC721G.sol";
import "@openzeppelin/contracts/interfaces/IERC721Enumerable.sol";

interface IERC721GEnumerable is IERC721G, IERC721Enumerable {
    function totalSupply() external view override(IERC721Enumerable, IERC721G) returns (uint256);
}
