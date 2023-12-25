// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "./interfaces/IFeeDB.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FeeDB is Ownable, IFeeDB {
    address public protocolFeeRecipient;

    mapping(IGaiaBridge.TokenType => uint256) internal _protocolFee; //for 1155, 721. absolute amount
    mapping(IGaiaBridge.TokenType => uint256) internal _protocolFeeRate; //for ETH, 20. rate of amount. out of 10000

    mapping(address => uint256) public userDiscountRate; //out of 10000
    mapping(address => TokenDiscountData) internal _tokenDiscountData;
    mapping(address => mapping(uint256 => TokenDiscountData)) internal _ERC1155DiscountData;

    constructor(address _protocolFeeRecipient) {
        protocolFeeRecipient = _protocolFeeRecipient;
        emit SetFeeRecipient(_protocolFeeRecipient);
    }

    function setProtocolFee(IGaiaBridge.TokenType tokenType, uint256 fee) external onlyOwner {
        require(tokenType >= IGaiaBridge.TokenType.ERC1155, "ONLY_FOR_1155_721");
        _protocolFee[tokenType] = fee;
        emit SetProtocolFee(tokenType, fee);
    }

    function setProtocolFeeRate(IGaiaBridge.TokenType tokenType, uint256 feeRate) external onlyOwner {
        require(tokenType <= IGaiaBridge.TokenType.ERC20, "ONLY_FOR_ETH_20");
        require(feeRate <= 10000, "MAX_RATE_OVER");
        _protocolFeeRate[tokenType] = feeRate;
        emit SetProtocolFeeRate(tokenType, feeRate);
    }

    function setFeeRecipient(address newRecipient) external onlyOwner {
        protocolFeeRecipient = newRecipient;
        emit SetFeeRecipient(newRecipient);
    }

    function updateUserDiscountRate(address[] calldata users, uint256[] calldata discountRates) external onlyOwner {
        require(users.length == discountRates.length, "LENGTH_NOT_EQUAL");
        for (uint256 i = 0; i < users.length; ) {
            require(discountRates[i] <= 10000, "MAX_RATE_OVER");
            userDiscountRate[users[i]] = discountRates[i];
            emit UpdateUserDiscountRate(users[i], discountRates[i]);
            unchecked {
                i++;
            }
        }
    }

    function updateTokenDiscountData(address[] calldata tokens, TokenDiscountData[] calldata discountData)
        external
        onlyOwner
    {
        require(tokens.length == discountData.length, "LENGTH_NOT_EQUAL");
        for (uint256 i = 0; i < tokens.length; ) {
            TokenDiscountData memory _data = discountData[i];
            require(_data.discountRate <= 10000, "MAX_RATE_OVER");
            if (_data.holdingAmount == 0) {
                //delete data
                require(_data.discountRate == 0, "INVALID_PARAMS");
                delete _tokenDiscountData[tokens[i]];
            } else {
                require(_data.discountRate != 0, "INVALID_PARAMS");
                _tokenDiscountData[tokens[i]].discountRate = _data.discountRate;
                _tokenDiscountData[tokens[i]].holdingAmount = _setHoldingAmount(_data.holdingAmount);
            }
            emit UpdateTokenDiscountData(tokens[i], _data.holdingAmount, _data.discountRate);

            unchecked {
                i++;
            }
        }
    }

    function updateERC1155DiscountData(
        address[] calldata tokens,
        uint256[] calldata ids,
        TokenDiscountData[] calldata discountData
    ) external onlyOwner {
        uint256 length = tokens.length;
        require(length == discountData.length && length == ids.length, "LENGTH_NOT_EQUAL");
        for (uint256 i = 0; i < length; ) {
            TokenDiscountData memory _data = discountData[i];
            require(_data.discountRate <= 10000, "MAX_RATE_OVER");
            if (_data.holdingAmount == 0) {
                //delete data
                require(_data.discountRate == 0, "INVALID_PARAMS");
                delete _ERC1155DiscountData[tokens[i]][ids[i]];
            } else {
                require(_data.discountRate != 0, "INVALID_PARAMS");
                _ERC1155DiscountData[tokens[i]][ids[i]].discountRate = _data.discountRate;
                _ERC1155DiscountData[tokens[i]][ids[i]].holdingAmount = _setHoldingAmount(_data.holdingAmount);
            }
            emit UpdateERC1155DiscountData(tokens[i], ids[i], _data.holdingAmount, _data.discountRate);

            unchecked {
                i++;
            }
        }
    }

    function _setHoldingAmount(uint240 holdingAmount) internal pure returns (uint240) {
        // for gas saving. if holdingAmount is 1(mostly, nft), storage value of holdingAmount is 0
        if (holdingAmount <= 1) return 0;
        else return holdingAmount - 1;
    }

    function _getHoldingAmount(uint240 holdingAmount) internal pure returns (uint240) {
        return holdingAmount + 1;
    }

    function protocolFee(IGaiaBridge.TokenType tokenType) external view returns (uint256) {
        require(tokenType >= IGaiaBridge.TokenType.ERC1155, "ONLY_FOR_1155_721");
        return _protocolFee[tokenType];
    }

    function protocolFeeRate(IGaiaBridge.TokenType tokenType) external view returns (uint256) {
        require(tokenType <= IGaiaBridge.TokenType.ERC20, "ONLY_FOR_ETH_20");
        return _protocolFeeRate[tokenType];
    }

    function tokenDiscountData(address token) external view returns (TokenDiscountData memory) {
        TokenDiscountData memory _data = _tokenDiscountData[token];

        if (_data.discountRate == 0) _data.holdingAmount = 0;
        else _data.holdingAmount = _getHoldingAmount(_data.holdingAmount);
        return _data;
    }

    function ERC1155DiscountData(address token, uint256 id) external view returns (TokenDiscountData memory) {
        TokenDiscountData memory _data = _ERC1155DiscountData[token][id];

        if (_data.discountRate == 0) _data.holdingAmount = 0;
        else _data.holdingAmount = _getHoldingAmount(_data.holdingAmount);
        return _data;
    }

    function getFeeInfo(
        address user,
        IGaiaBridge.TokenType tokenType,
        address,
        uint256[] calldata,
        uint256[] calldata amounts,
        bytes calldata data
    ) external view returns (address recipient, uint256 fee) {
        uint256 dcRate = _getDiscountRate(user, data);
        if (dcRate == 10000) return (address(0), 0);

        uint256 _userDcRate = userDiscountRate[user];
        if (_userDcRate == 10000) return (address(0), 0);

        if (dcRate < _userDcRate) dcRate = _userDcRate;

        recipient = protocolFeeRecipient;
        if (tokenType <= IGaiaBridge.TokenType.ERC20) {
            require(amounts.length == 1, "INVALID_LENGTH");

            uint256 feeRate = _protocolFeeRate[tokenType];
            fee = (amounts[0] * feeRate) / 10000;
        } else {
            //1155, 721
            uint256 totalAmount;
            for (uint256 i = 0; i < amounts.length; ++i) {
                if (tokenType == IGaiaBridge.TokenType.ERC721) require(amounts[i] == 1, "INVALID_ERC721_AMOUNT");
                totalAmount += amounts[i];
            }
            fee = _protocolFee[tokenType] * totalAmount;
        }
        fee = (fee * (10000 - dcRate)) / 10000;
    }

    function _getDiscountRate(address user, bytes calldata data) internal view returns (uint256 dcRate) {
        if (data.length == 2) {
            dcRate = uint256(uint16(bytes2(data)));
            require(dcRate <= 10000, "OUTRANGED_MANUAL_RATE");
        } else if (data.length == 32) {
            address token = abi.decode(data, (address));
            if (token != address(0)) {
                TokenDiscountData memory _data = _tokenDiscountData[token];
                if (_data.discountRate == 0) return 0;
                require(IERC20(token).balanceOf(user) >= _getHoldingAmount(_data.holdingAmount), "UNAUTHORIZED"); //both 20 and 721 have same signature
                dcRate = _data.discountRate;
            }
        } else if (data.length == 64) {
            (address token1155, uint256 tokenId) = abi.decode(data, (address, uint256));
            if (token1155 != address(0)) {
                TokenDiscountData memory _data = _ERC1155DiscountData[token1155][tokenId];
                if (_data.discountRate == 0) return 0;
                require(
                    IERC1155(token1155).balanceOf(user, tokenId) >= _getHoldingAmount(_data.holdingAmount),
                    "UNAUTHORIZED"
                );
                dcRate = _data.discountRate;
            }
        }
    }
}
