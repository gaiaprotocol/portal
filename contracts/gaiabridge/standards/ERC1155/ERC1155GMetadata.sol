// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "./IERC1155GMetadata.sol";
import "./ERC1155G.sol";

contract ERC1155GMetadata is ERC1155G, IERC1155GMetadata {
    using Strings for uint256;

    //keccak256("METADATA_OPERATOR_ROLE");
    bytes32 internal constant METADATA_OPERATOR_ROLE =
        0x528d9a33c9629b593080cfad8bd1d81718c45270a309d1b4e508037a4a612df7;

    string public name;
    string public symbol;
    mapping(uint256 => string) internal _tokenURIs;

    bool public isIDSubstitutedByClient;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _uri,
        bool _isIDSubstitutedByClient
    ) ERC1155G(_uri) {
        name = _name;
        symbol = _symbol;
        isIDSubstitutedByClient = _isIDSubstitutedByClient;
        _setupRole(METADATA_OPERATOR_ROLE, msg.sender);
    }

    function exists(uint256 tokenId) public view virtual override(ERC1155G, IERC1155G) returns (bool) {
        return super.exists(tokenId);
    }

    function totalSupply(uint256 tokenId) public view virtual override(ERC1155G, IERC1155G) returns (uint256) {
        return super.totalSupply(tokenId);
    }

    function toggleIsIDSubstitutedByClient() external virtual {
        require(
            hasRole(METADATA_OPERATOR_ROLE, msg.sender),
            "ERC1155G: must have metadata operator role to toggle isIDSubstitutedByClient"
        );

        isIDSubstitutedByClient = !isIDSubstitutedByClient;
    }

    function uri(uint256 tokenId) public view virtual override(ERC1155, IERC1155GMetadata) returns (string memory) {
        string memory _tokenURI = _tokenURIs[tokenId];
        if (bytes(_tokenURI).length > 0) return _tokenURI;
        if (isIDSubstitutedByClient) return super.uri(tokenId);

        string memory baseURI = super.uri(tokenId);
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString())) : "";
    }

    function setBaseURI(string calldata baseURI_) external virtual {
        require(
            hasRole(METADATA_OPERATOR_ROLE, msg.sender),
            "ERC1155G: must have metadata operator role to setBaseURI"
        );

        _setURI(baseURI_);
    }

    function setTokenURI(uint256 tokenId, string calldata _tokenURI) external virtual {
        require(
            hasRole(METADATA_OPERATOR_ROLE, msg.sender),
            "ERC1155G: must have metadata operator role to setTokenURI"
        );

        require(exists(tokenId), "ERC1155G: token doesn't exist");
        _setTokenURI(tokenId, _tokenURI);
    }

    function mintWithURI(
        address to,
        uint256 tokenId,
        uint256 amount,
        bytes calldata data,
        string calldata _tokenURI
    ) external virtual {
        require(hasRole(MINTER_ROLE, msg.sender), "ERC1155G: must have minter role to mint");

        _mint(to, tokenId, amount, data);
        _setTokenURI(tokenId, _tokenURI);
    }

    function mintBatchWithURI(
        address to,
        uint256[] calldata tokenIds,
        uint256[] calldata amounts,
        bytes calldata data,
        string[] calldata __tokenURIs
    ) external virtual {
        require(hasRole(MINTER_ROLE, msg.sender), "ERC1155G: must have minter role to mint");
        require(tokenIds.length == __tokenURIs.length, "LENGTH_NOT_EQUAL");

        _mintBatch(to, tokenIds, amounts, data);
        for (uint256 i = 0; i < tokenIds.length; ++i) {
            _setTokenURI(tokenIds[i], __tokenURIs[i]);
        }
    }

    function _setTokenURI(uint256 tokenId, string calldata _tokenURI) internal virtual {
        _tokenURIs[tokenId] = _tokenURI;
    }
}
