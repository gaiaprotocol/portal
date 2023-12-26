// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "../ERC721/IERC721GEnumerable.sol";

contract ERC721GEnumerableUtil {
    function getTotalTokenIds(address nftAddress, address owner) external view returns (uint256[] memory) {
        IERC721GEnumerable nft = IERC721GEnumerable(nftAddress);
        uint256[] memory tokenIds = new uint256[](nft.balanceOf(owner));
        for (uint256 i = 0; i < tokenIds.length; i++) {
            tokenIds[i] = nft.tokenOfOwnerByIndex(owner, i);
        }
        return tokenIds;
    }
}