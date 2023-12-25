// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "../GaiaBridge.sol";

contract MockGaiaBridge is GaiaBridge {
    constructor(
        address _feeDB,
        uint48 _quorum,
        address[] memory _signers
    ) GaiaBridge(_feeDB, _quorum, _signers) {}

    function transferTokensInternal(
        TokenDataToBeBridged calldata tokenData,
        address from,
        address to,
        bool isTransferType
    ) external {
        _transferTokens(
            tokenData.tokenType,
            tokenData.tokenAddress,
            tokenData.ids,
            tokenData.amounts,
            from,
            to,
            isTransferType
        );
    }
}
