// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "./ERC721G.sol";
import "./IERC721GURIStorage.sol";

contract ERC721GURIStorage is ERC721G, IERC721GURIStorage {
    using Strings for uint256;

    mapping(uint256 => string) internal _tokenURIs;

    constructor(
        string memory name,
        string memory symbol,
        string memory baseURI_
    ) ERC721G(name, symbol, baseURI_) {}

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override(ERC721G, IERC721GURIStorage)
        returns (string memory)
    {
        _requireMinted(tokenId);

        string memory _tokenURI = _tokenURIs[tokenId];
        if (bytes(_tokenURI).length > 0) return _tokenURI;
        return super.tokenURI(tokenId);
    }

    function setTokenURI(uint256 tokenId, string calldata _tokenURI) external virtual {
        require(
            hasRole(METADATA_OPERATOR_ROLE, msg.sender),
            "ERC721G: must have metadata operator role to setTokenURI"
        );

        _requireMinted(tokenId);
        _setTokenURI(tokenId, _tokenURI);
    }

    function mintWithURI(
        address to,
        uint256 tokenId,
        string calldata _tokenURI
    ) external virtual {
        require(hasRole(MINTER_ROLE, msg.sender), "ERC721G: must have minter role to mint");

        _mint(to, tokenId);
        _setTokenURI(tokenId, _tokenURI);
    }

    function mintBatchWithURI(
        address to,
        uint256[] calldata tokenIds,
        string[] calldata __tokenURIs
    ) external virtual {
        require(hasRole(MINTER_ROLE, msg.sender), "ERC721G: must have minter role to mint");
        require(tokenIds.length == __tokenURIs.length, "LENGTH_NOT_EQUAL");

        _mintBatch(to, tokenIds);
        for (uint256 i = 0; i < tokenIds.length; ++i) {
            _setTokenURI(tokenIds[i], __tokenURIs[i]);
        }
    }

    function _setTokenURI(uint256 tokenId, string calldata _tokenURI) internal virtual {
        _tokenURIs[tokenId] = _tokenURI;
    }

    function _removeTokenURI(uint256 tokenId) internal virtual {
        if (bytes(_tokenURIs[tokenId]).length != 0) {
            delete _tokenURIs[tokenId];
        }
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId);

        if (to == address(0)) {
            _removeTokenURI(tokenId);
        }
    }

    function _beforeTokenBatchTransfer(
        address from,
        address to,
        uint256[] calldata tokenIds
    ) internal virtual override {
        super._beforeTokenBatchTransfer(from, to, tokenIds);

        if (to == address(0)) {
            for (uint256 i = 0; i < tokenIds.length; i++) {
                _removeTokenURI(tokenIds[i]);
            }
        }
    }
}
