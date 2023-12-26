// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "./IERC1155G.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract ERC1155G is ERC1155, ERC1155Supply, IERC1155G, AccessControl, Pausable {
    //keccak256("MINTER_ROLE");
    bytes32 internal constant MINTER_ROLE = 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6;
    //keccak256("PAUSER_ROLE");
    bytes32 internal constant PAUSER_ROLE = 0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a;
    //keccak256("BURNER_ROLE");
    bytes32 internal constant BURNER_ROLE = 0x3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a848;

    constructor(string memory uri) ERC1155(uri) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(PAUSER_ROLE, msg.sender);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(AccessControl, ERC1155, IERC165)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function exists(uint256 tokenId) public view virtual override(IERC1155G, ERC1155Supply) returns (bool) {
        return super.exists(tokenId);
    }

    function totalSupply(uint256 tokenId) public view virtual override(IERC1155G, ERC1155Supply) returns (uint256) {
        return super.totalSupply(tokenId);
    }

    function setPause(bool status) external virtual {
        require(hasRole(PAUSER_ROLE, msg.sender), "ERC1155G: must have pauser role to pause");

        if (status) _pause();
        else _unpause();
    }

    function mint(
        address to,
        uint256 tokenId,
        uint256 amount,
        bytes calldata data
    ) public virtual {
        require(hasRole(MINTER_ROLE, msg.sender), "ERC1155G: must have minter role to mint");

        _mint(to, tokenId, amount, data);
    }

    function mintBatch(
        address to,
        uint256[] calldata tokenIds,
        uint256[] calldata amounts,
        bytes calldata data
    ) external virtual {
        require(hasRole(MINTER_ROLE, msg.sender), "ERC1155G: must have minter role to mint");

        _mintBatch(to, tokenIds, amounts, data);
    }

    function burn(
        address from,
        uint256 tokenId,
        uint256 amount
    ) external virtual {
        require(hasRole(BURNER_ROLE, msg.sender), "ERC1155G: must have burner role to burn");

        require(from == msg.sender || isApprovedForAll(from, msg.sender), "UNAUTHORIZED");
        _burn(from, tokenId, amount);
    }

    function burnBatch(
        address from,
        uint256[] calldata tokenIds,
        uint256[] calldata amounts
    ) external virtual {
        require(hasRole(BURNER_ROLE, msg.sender), "ERC1155G: must have burner role to burn");

        require(from == msg.sender || isApprovedForAll(from, msg.sender), "UNAUTHORIZED");
        _burnBatch(from, tokenIds, amounts);
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override(ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);

        require(!paused(), "ERC1155G: token transfer while paused");
    }
}
