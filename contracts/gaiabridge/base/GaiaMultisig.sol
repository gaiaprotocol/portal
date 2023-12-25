// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "../interfaces/IGaiaMultisig.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract GaiaMultisig is IGaiaMultisig {
    address[] internal signers;
    mapping(address => uint256) internal signerIndex;
    uint48 public signingNonce;
    uint48 public quorum;

    constructor(uint48 _quorum, address[] memory _signers) {
        require(_quorum > 0, "QUORUM_0");
        quorum = _quorum;
        emit UpdateQuorum(_quorum);

        require(_signers.length > _quorum, "INVALID_SIGNERS_LENGTH");
        signers = _signers;

        for (uint256 i = 0; i < _signers.length; ++i) {
            address signer = _signers[i];
            require(signer != address(0), "SIGNER_ADDRESS_0");
            require(signerIndex[signer] == 0, "SIGNER_DUP");

            signerIndex[signer] = i + 1;
            emit AddSigner(signer);
        }
    }

    function signersLength() public view returns (uint256) {
        return signers.length;
    }

    function isSigner(address signer) public view returns (bool) {
        return signerIndex[signer] != 0;
    }

    function getSigners() external view returns (address[] memory) {
        return signers;
    }

    function _checkSigners(bytes32 message, CompactSig[] calldata sigs) internal view {
        uint256 length = sigs.length;
        require(length >= quorum, "INSUFFICIENT_SIGNERS");

        address lastSigner;
        for (uint256 i = 0; i < length; ++i) {
            address signer = ECDSA.recover(message, sigs[i].r, sigs[i]._vs);
            require(lastSigner < signer && signerIndex[signer] != 0, "INVALID_SIGNERS");
            lastSigner = signer;
        }
    }

    function addSigner(address signer, CompactSig[] calldata sigs) external {
        require(signer != address(0), "SIGNER_ADDRESS_0");
        require(signerIndex[signer] == 0, "ALREADY_ADDED");

        bytes32 hash = keccak256(abi.encodePacked("addSigner", block.chainid, address(this), signer, signingNonce++));
        _checkSigners(ECDSA.toEthSignedMessageHash(hash), sigs);

        signers.push(signer);
        signerIndex[signer] = signers.length;
        emit AddSigner(signer);
    }

    function removeSigner(address signer, CompactSig[] calldata sigs) external {
        require(signer != address(0), "SIGNER_ADDRESS_0");
        require(signerIndex[signer] != 0, "NOT_ADDED");

        bytes32 hash = keccak256(
            abi.encodePacked("removeSigner", block.chainid, address(this), signer, signingNonce++)
        );
        _checkSigners(ECDSA.toEthSignedMessageHash(hash), sigs);

        uint256 lastIndex = signers.length - 1;
        require(lastIndex > quorum, "EQUAL_SIGNERS_QUORUM");

        uint256 _signerIndex = signerIndex[signer];
        uint256 targetIndex = _signerIndex - 1;
        if (targetIndex != lastIndex) {
            address lastSigner = signers[lastIndex];
            signers[targetIndex] = lastSigner;
            signerIndex[lastSigner] = _signerIndex;
        }

        signers.pop();
        delete signerIndex[signer];

        emit RemoveSigner(signer);
    }

    function updateQuorum(uint48 newQuorum, CompactSig[] calldata sigs) external {
        require(newQuorum > 0 && newQuorum < signers.length, "INVALID_PARAMETER");

        bytes32 hash = keccak256(
            abi.encodePacked("updateQuorum", block.chainid, address(this), newQuorum, signingNonce++)
        );
        _checkSigners(ECDSA.toEthSignedMessageHash(hash), sigs);

        quorum = newQuorum;
        emit UpdateQuorum(newQuorum);
    }
}
