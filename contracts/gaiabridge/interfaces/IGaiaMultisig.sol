// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

interface IGaiaMultisig {
    struct CompactSig {
        bytes32 r;
        bytes32 _vs;
    }

    event AddSigner(address signer);
    event RemoveSigner(address signer);
    event UpdateQuorum(uint256 newQuorum);

    function getSigners() external view returns (address[] memory);

    function signingNonce() external view returns (uint48);

    function quorum() external view returns (uint48);

    function signersLength() external view returns (uint256);

    function isSigner(address signer) external view returns (bool);
}
