// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "./interfaces/IGaiaBridge.sol";
import "./interfaces/IFeeDB.sol";
import "./base/GaiaMultisig.sol";
import "./base/ERC1155Holder.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract GaiaBridge is IGaiaBridge, GaiaMultisig, ERC1155Holder, ReentrancyGuard, Pausable {
    using Address for *;
    using SafeERC20 for IERC20;

    address public feeDB;
    uint256 public constant BATCH_TRANSFER_LIMIT = 10;
    mapping(bytes32 => TokenInfo) internal _tokenInfo;

    constructor(
        address _feeDB,
        uint48 _quorum,
        address[] memory _signers
    ) GaiaMultisig(_quorum, _signers) {
        require(_feeDB != address(0), "INVALID_ADDRESS");
        feeDB = _feeDB;
        emit UpdateFeeDB(_feeDB);
    }

    function setPause(bool status, CompactSig[] calldata sigs) external {
        bytes32 hash = keccak256(abi.encodePacked("setPause", block.chainid, address(this), status, signingNonce++));
        _checkSigners(ECDSA.toEthSignedMessageHash(hash), sigs);

        if (status) _pause();
        else _unpause();
    }

    function updateFeeDB(address newFeeDB, CompactSig[] calldata sigs) external {
        bytes32 hash = keccak256(
            abi.encodePacked("updateFeeDB", block.chainid, address(this), newFeeDB, signingNonce++)
        );
        _checkSigners(ECDSA.toEthSignedMessageHash(hash), sigs);

        require(newFeeDB != address(0), "ADDRESS_0");
        feeDB = newFeeDB;
        emit UpdateFeeDB(newFeeDB);
    }

    function emergencyWithdrawTokens(
        TokenDataToBeBridged[] calldata tokenData,
        address recipient,
        CompactSig[] calldata sigs
    ) external {
        bytes memory _tokenData = abi.encode(tokenData);
        bytes32 hash = keccak256(
            abi.encodePacked(
                "emergencyWithdrawTokens",
                block.chainid,
                address(this),
                _tokenData,
                recipient,
                signingNonce++
            )
        );
        _checkSigners(ECDSA.toEthSignedMessageHash(hash), sigs);

        for (uint256 i = 0; i < tokenData.length; ) {
            if (tokenData[i].tokenType == TokenType.ETH) {
                require(
                    tokenData[i].tokenAddress == address(0) &&
                        tokenData[i].ids.length == 1 &&
                        tokenData[i].amounts.length == 1,
                    "INVALID_ETH_PARAMS"
                );
                require(address(this).balance != 0, "ETH_BALANCE_0");

                uint256 amount = tokenData[i].amounts[0] > address(this).balance
                    ? address(this).balance
                    : tokenData[i].amounts[0];
                payable(recipient).sendValue(amount);
            } else {
                _giveTokens(recipient, tokenData[i], true);
            }
            unchecked {
                i++;
            }
        }
    }

    function setTokenInfo(
        bytes32[] calldata tokenHashes,
        address[] calldata tokenAddresses,
        bool[] calldata isTransferTypes,
        CompactSig[] calldata sigs
    ) external {
        bytes32 hash = keccak256(
            abi.encodePacked(
                "setTokenInfo",
                block.chainid,
                address(this),
                tokenHashes,
                tokenAddresses,
                isTransferTypes,
                signingNonce++
            )
        );
        _checkSigners(ECDSA.toEthSignedMessageHash(hash), sigs);

        uint256 length = tokenHashes.length;
        require(tokenAddresses.length == length && isTransferTypes.length == length, "LENGTH_NOT_EQUAL");
        for (uint256 i = 0; i < length; ++i) {
            _tokenInfo[tokenHashes[i]].token = tokenAddresses[i];
            _tokenInfo[tokenHashes[i]].isTransferType = isTransferTypes[i];
            emit SetTokenInfo(tokenHashes[i], tokenAddresses[i], isTransferTypes[i]);
        }
    }

    mapping(address => mapping(uint256 => uint32[])) internal _sentAt; //_sentAt[sender][toChainId][sendingId]
    mapping(address => mapping(uint256 => mapping(uint256 => bool))) internal _isTokensReceived; //_isTokensReceived[sender][fromChainId][sendingId]

    function sentAt(
        address sender,
        uint256 toChainId,
        uint256 sendingId
    ) external view returns (uint32 atBlock) {
        return _sentAt[sender][toChainId][sendingId];
    }

    function isTokensReceived(
        address sender,
        uint256 fromChainId,
        uint256 sendingId
    ) public view returns (bool) {
        return _isTokensReceived[sender][fromChainId][sendingId];
    }

    function sendingCounts(address sender, uint256 toChainId) public view returns (uint256) {
        return _sentAt[sender][toChainId].length;
    }

    function tokenHash(TokenType tokenType, string memory tokenName) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(tokenType, tokenName));
    }

    function tokenInfo(bytes32 _tokenHash) external view returns (TokenInfo memory) {
        return _tokenInfo[_tokenHash];
    }

    function sendETH(
        uint256 toChainId,
        address receiver,
        uint256 amount,
        bytes calldata data,
        CompactSig[] calldata sigs
    ) external payable nonReentrant whenNotPaused returns (uint256 sendingId) {
        require(receiver != address(0), "RECEIVER_ADDRESS_0");

        sendingId = sendingCounts(msg.sender, toChainId);
        _sentAt[msg.sender][toChainId].push(uint32(block.number % 2**32));

        //for manual discount
        if (data.length == 2) {
            bytes32 hash = keccak256(
                abi.encodePacked("manualDiscount", block.chainid, address(this), data, signingNonce++)
            );
            _checkSigners(ECDSA.toEthSignedMessageHash(hash), sigs);
        }

        uint256[] memory ids = _asSingletonArray(0);
        uint256[] memory amounts = _asSingletonArray(amount);

        (address feeRecipient, uint256 fee) = IFeeDB(feeDB).getFeeInfo(
            msg.sender,
            TokenType.ETH,
            address(0),
            ids,
            amounts,
            data
        );

        _collectFee(TokenType.ETH, address(0), fee, feeRecipient);
        require(msg.value == amount + fee, "INVALID_MSG_VALUE");

        emit SendETH(msg.sender, toChainId, receiver, amount, sendingId);
    }

    function sendTokens(
        uint256 toChainId,
        address receiver,
        TokenDataToBeBridged calldata tokenData,
        bytes memory data,
        CompactSig[] calldata sigs
    ) external payable nonReentrant whenNotPaused returns (uint256 sendingId) {
        require(receiver != address(0), "RECEIVER_ADDRESS_0");
        require(tokenData.tokenType != TokenType.ETH && tokenData.tokenAddress != address(0), "USE_SENDETH");
        TokenInfo memory info = _tokenInfo[tokenHash(tokenData.tokenType, tokenData.tokenName)];
        require(info.token == tokenData.tokenAddress, "TOKEN_DATA_DISCORD");
        {
            //to avoid stack too deep error
            uint256 amount = tokenData.amounts.length;
            require(amount == tokenData.ids.length, "ID_AMOUTS_LENGTH_NOT_EQUAL");
            require(amount != 0 && amount <= BATCH_TRANSFER_LIMIT, "INVALID_AMOUNT");
            if (tokenData.tokenType == TokenType.ERC20) require(amount == 1, "INVALID_AMOUNT");
        }
        sendingId = sendingCounts(msg.sender, toChainId);
        _sentAt[msg.sender][toChainId].push(uint32(block.number % 2**32));

        //for manual discount
        if (data.length == 2) {
            bytes32 hash = keccak256(
                abi.encodePacked("manualDiscount", block.chainid, address(this), data, signingNonce++)
            );
            _checkSigners(ECDSA.toEthSignedMessageHash(hash), sigs);
        }
        {
            //to avoid stack too deep error
            (address feeRecipient, uint256 fee) = IFeeDB(feeDB).getFeeInfo(
                msg.sender,
                tokenData.tokenType,
                tokenData.tokenAddress,
                tokenData.ids,
                tokenData.amounts,
                data
            );

            _collectTokens(tokenData, info.isTransferType);
            _collectFee(tokenData.tokenType, tokenData.tokenAddress, fee, feeRecipient);
            if (tokenData.tokenType != TokenType.ERC20) require(msg.value == fee, "INVALID_MSG_VALUE");
        }

        emit SendTokens(msg.sender, toChainId, receiver, tokenData, sendingId);
    }

    function receiveETH(
        address sender,
        uint256 fromChainId,
        address receiver,
        uint256 amount,
        uint256 sendingId,
        CompactSig[] calldata sigs
    ) external nonReentrant whenNotPaused {
        require(!_isTokensReceived[sender][fromChainId][sendingId], "ALREADY_RECEIVED");

        bytes32 hash = keccak256(
            abi.encodePacked(address(this), fromChainId, sender, block.chainid, receiver, amount, sendingId)
        );
        _checkSigners(ECDSA.toEthSignedMessageHash(hash), sigs);

        _isTokensReceived[sender][fromChainId][sendingId] = true;
        payable(receiver).sendValue(amount);
        emit ReceiveETH(sender, fromChainId, receiver, amount, sendingId);
    }

    function receiveTokens(
        address sender,
        uint256 fromChainId,
        address receiver,
        TokenDataToBeBridged calldata tokenData,
        uint256 sendingId,
        bytes calldata feeData,
        CompactSig[] calldata sigs
    ) external payable nonReentrant whenNotPaused {
        require(!_isTokensReceived[sender][fromChainId][sendingId], "ALREADY_RECEIVED");
        require(tokenData.tokenType != TokenType.ETH && tokenData.tokenAddress != address(0), "USE_RECEIVEETH");
        require(receiver != address(0), "RECEIVER_ADDRESS_0");
        TokenInfo memory info = _tokenInfo[tokenHash(tokenData.tokenType, tokenData.tokenName)];
        require(info.token == tokenData.tokenAddress, "TOKEN_DATA_DISCORD");
        {
            //to avoid stack too deep error
            uint256 amount = tokenData.amounts.length;
            require(amount == tokenData.ids.length, "ID_AMOUTS_LENGTH_NOT_EQUAL");
            require(amount != 0 && amount <= BATCH_TRANSFER_LIMIT, "INVALID_AMOUNT");
            if (tokenData.tokenType == TokenType.ERC20) require(amount == 1, "INVALID_AMOUNT");
        }
        {
            //to avoid stack too deep error
            bytes memory _tokenData = abi.encodePacked(
                tokenData.tokenType,
                tokenData.tokenName,
                tokenData.tokenAddress,
                tokenData.ids,
                tokenData.amounts
            );
            bytes32 hash = keccak256(
                abi.encodePacked(
                    address(this),
                    fromChainId,
                    sender,
                    block.chainid,
                    receiver,
                    _tokenData,
                    sendingId,
                    feeData
                )
            );
            _checkSigners(ECDSA.toEthSignedMessageHash(hash), sigs);
        }

        _isTokensReceived[sender][fromChainId][sendingId] = true;
        
        if (feeData.length != 0) {
            require(feeData.length == 2, "INVALID_FEEDATA");
            require(tokenData.tokenType != TokenType.ERC20, "INVALID_TOKEN_TYPE");

            (address feeRecipient, uint256 fee) = IFeeDB(feeDB).getFeeInfo(
                msg.sender,
                tokenData.tokenType,
                tokenData.tokenAddress,
                tokenData.ids,
                tokenData.amounts,
                feeData
            );

            _collectFee(tokenData.tokenType, tokenData.tokenAddress, fee, feeRecipient);
            if (tokenData.tokenType != TokenType.ERC20) require(msg.value == fee, "INVALID_MSG_VALUE");
        } else {
            require(msg.value == 0, "INVALID_MSG_VALUE");
        }
        
        _giveTokens(receiver, tokenData, info.isTransferType);
        emit ReceiveTokens(sender, fromChainId, receiver, tokenData, sendingId);
    }

    function _transferTokens(
        TokenType tokenType,
        address tokenAddress,
        uint256[] calldata tokenIds,
        uint256[] calldata amounts,
        address from,
        address to,
        bool isTransferred
    ) internal {
        uint256 amount = amounts.length;
        require(amount == tokenIds.length, "ID_AMOUTS_LENGTH_NOT_EQUAL");
        require(amount > 0, "INVALID_TRANSFER");

        if (tokenType == TokenType.ETH) {
            revert("INVALID_ETH_TRANSFER");
        } else if (tokenType == TokenType.ERC20) {
            require(amount == 1, "BATCH_TRANSFER_NOT_ALLOWED");
            require(tokenIds[0] == 0, "INVALID_ID_ERC20");
            require(amounts[0] > 0, "AMOUNT_0");

            if (from == address(this)) {
                if (isTransferred) IERC20(tokenAddress).safeTransfer(to, amounts[0]);
                else IERC20G(tokenAddress).mint(to, amounts[0]);
            } else {
                if (isTransferred) IERC20(tokenAddress).safeTransferFrom(from, to, amounts[0]);
                else {
                    require(to == address(this), "INVALID_TO");
                    IERC20G(tokenAddress).burnFrom(from, amounts[0]);
                }
            }
        } else if (tokenType == TokenType.ERC1155) {
            require(tokenAddress.isContract(), "NOT_CONTRACT");

            if (isTransferred) IERC1155(tokenAddress).safeBatchTransferFrom(from, to, tokenIds, amounts, "");
            else if (from == address(this)) {
                IERC1155G(tokenAddress).mintBatch(to, tokenIds, amounts, "");
            } else {
                require(to == address(this), "INVALID_TO");
                IERC1155G(tokenAddress).burnBatch(from, tokenIds, amounts);
            }
        } else {
            // TokenType.ERC721
            require(tokenAddress.isContract(), "NOT_CONTRACT");

            if (isTransferred) {
                try IERC721G(tokenAddress).batchTransferFrom(from, to, tokenIds) {} catch {
                    for (uint256 i = 0; i < amount; ++i) {
                        require(amounts[i] == 1, "INVALID_AMOUNT_ERC721");
                        IERC721(tokenAddress).transferFrom(from, to, tokenIds[i]);
                    }
                }
            } else if (from == address(this)) {
                IERC721G(tokenAddress).mintBatch(to, tokenIds);
            } else {
                require(to == address(this), "INVALID_TO");
                IERC721G(tokenAddress).burnBatch(from, tokenIds);
            }
        }
    }

    function _collectFee(
        TokenType tokenType,
        address tokenAddress,
        uint256 fee,
        address feeRecipient
    ) internal {
        if (feeRecipient == address(0) || fee == 0) return;

        if (tokenType == TokenType.ERC20) {
            IERC20(tokenAddress).safeTransferFrom(msg.sender, feeRecipient, fee);
            emit TransferFee(tokenAddress, msg.sender, feeRecipient, fee);
        } else {
            payable(feeRecipient).sendValue(fee);
            emit TransferFee(address(0), msg.sender, feeRecipient, fee);
        }
    }

    function _collectTokens(TokenDataToBeBridged calldata tokenData, bool isTransferred) internal virtual {
        _transferTokens(
            tokenData.tokenType,
            tokenData.tokenAddress,
            tokenData.ids,
            tokenData.amounts,
            msg.sender,
            address(this),
            isTransferred
        );
    }

    function _giveTokens(
        address receiver,
        TokenDataToBeBridged calldata tokenData,
        bool isTransferred
    ) internal virtual {
        _transferTokens(
            tokenData.tokenType,
            tokenData.tokenAddress,
            tokenData.ids,
            tokenData.amounts,
            address(this),
            receiver,
            isTransferred
        );
    }

    function _asSingletonArray(uint256 element) private pure returns (uint256[] memory) {
        uint256[] memory array = new uint256[](1);
        array[0] = element;

        return array;
    }
}
