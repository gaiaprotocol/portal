// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "./IGaiaBridge.sol";

interface IFeeDB {
    struct TokenDiscountData {
        uint16 discountRate;
        uint240 holdingAmount;
    }

    event SetProtocolFee(IGaiaBridge.TokenType tokenType, uint256 fee);
    event SetProtocolFeeRate(IGaiaBridge.TokenType tokenType, uint256 feeRate);
    event SetFeeRecipient(address newRecipient);
    event UpdateUserDiscountRate(address user, uint256 discountRate);
    event UpdateTokenDiscountData(address token, uint256 holdingAmount, uint256 discountRate);
    event UpdateERC1155DiscountData(address token, uint256 id, uint256 holdingAmount, uint256 discountRate);

    function protocolFeeRecipient() external view returns (address);

    function protocolFee(IGaiaBridge.TokenType tokenType) external view returns (uint256);

    function protocolFeeRate(IGaiaBridge.TokenType tokenType) external view returns (uint256);

    function userDiscountRate(address user) external view returns (uint256);

    function tokenDiscountData(address token) external view returns (TokenDiscountData memory);

    function ERC1155DiscountData(address token, uint256 id) external view returns (TokenDiscountData memory);

    function getFeeInfo(
        address user,
        IGaiaBridge.TokenType tokenType,
        address tokenAddress,
        uint256[] calldata ids,
        uint256[] calldata amounts,
        bytes calldata data
    ) external view returns (address recipient, uint256 fee);
}
