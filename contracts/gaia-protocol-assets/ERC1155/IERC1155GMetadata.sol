// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "./IERC1155G.sol";

interface IERC1155GMetadata is IERC1155G {
    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

    function uri(uint256 tokenId) external view returns (string memory);

    function isIDSubstitutedByClient() external view returns (bool);

    function mintWithURI(
        address to,
        uint256 tokenId,
        uint256 amount,
        bytes calldata data,
        string calldata _tokenURI
    ) external;

    function mintBatchWithURI(
        address to,
        uint256[] calldata tokenIds,
        uint256[] calldata amounts,
        bytes calldata data,
        string[] calldata __tokenURIs
    ) external;
}
