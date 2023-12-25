// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "../standards/ERC20/IERC20G.sol";
import "../standards/ERC1155/IERC1155G.sol";
import "../standards/ERC721/IERC721G.sol";
import "./IGaiaMultisig.sol";

interface IGaiaBridge is IGaiaMultisig {
    enum TokenType {
        ETH,
        ERC20,
        ERC1155,
        ERC721
    }

    struct TokenInfo {
        address token;
        bool isTransferType;
    }

    struct TokenDataToBeBridged {
        TokenType tokenType;
        string tokenName;
        address tokenAddress;
        uint256[] ids;
        uint256[] amounts;
    }

    event UpdateFeeDB(address newFeeDB);
    event SendETH(
        address indexed sender,
        uint256 indexed toChainId,
        address receiver,
        uint256 amount,
        uint256 indexed sendingId
    );
    event SendTokens(
        address indexed sender,
        uint256 indexed toChainId,
        address receiver,
        TokenDataToBeBridged tokenData,
        uint256 indexed sendingId
    );
    event ReceiveETH(
        address indexed sender,
        uint256 indexed fromChainId,
        address indexed receiver,
        uint256 amount,
        uint256 sendingId
    );
    event ReceiveTokens(
        address indexed sender,
        uint256 indexed fromChainId,
        address indexed receiver,
        TokenDataToBeBridged tokenData,
        uint256 sendingId
    );
    event SetTokenInfo(bytes32 tokenHash, address tokenAddress, bool isTransferType);
    event TransferFee(address feeToken, address user, address feeRecipient, uint256 amount);

    function BATCH_TRANSFER_LIMIT() external view returns (uint256);

    function feeDB() external view returns (address);

    function tokenInfo(bytes32 tokenHash) external view returns (TokenInfo memory);

    function sentAt(
        address sender,
        uint256 toChainId,
        uint256 sendingId
    ) external view returns (uint32 atBlock);

    function isTokensReceived(
        address sender,
        uint256 fromChainId,
        uint256 sendingId
    ) external view returns (bool);

    function sendingCounts(address sender, uint256 toChainId) external view returns (uint256);

    function sendETH(
        uint256 toChainId,
        address receiver,
        uint256 amount,
        bytes calldata data,
        CompactSig[] calldata sigs
    ) external payable returns (uint256 sendingId);

    function sendTokens(
        uint256 toChainId,
        address receiver,
        TokenDataToBeBridged calldata tokenData,
        bytes calldata data,
        CompactSig[] calldata sigs
    ) external payable returns (uint256 sendingId);

    function receiveETH(
        address sender,
        uint256 fromChainId,
        address receiver,
        uint256 amount,
        uint256 sendingId,
        CompactSig[] calldata sigs
    ) external;

    function receiveTokens(
        address sender,
        uint256 fromChainId,
        address receiver,
        TokenDataToBeBridged calldata tokenData,
        uint256 sendingId,
        bytes calldata feeData,
        CompactSig[] calldata sigs
    ) external payable;
}
