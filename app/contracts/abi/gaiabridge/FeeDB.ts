/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export declare namespace IFeeDB {
  export type TokenDiscountDataStruct = {
    discountRate: BigNumberish;
    holdingAmount: BigNumberish;
  };

  export type TokenDiscountDataStructOutput = [
    discountRate: bigint,
    holdingAmount: bigint
  ] & { discountRate: bigint; holdingAmount: bigint };
}

export interface FeeDBInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "ERC1155DiscountData"
      | "getFeeInfo"
      | "owner"
      | "protocolFee"
      | "protocolFeeRate"
      | "protocolFeeRecipient"
      | "renounceOwnership"
      | "setFeeRecipient"
      | "setProtocolFee"
      | "setProtocolFeeRate"
      | "tokenDiscountData"
      | "transferOwnership"
      | "updateERC1155DiscountData"
      | "updateTokenDiscountData"
      | "updateUserDiscountRate"
      | "userDiscountRate"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "OwnershipTransferred"
      | "SetFeeRecipient"
      | "SetProtocolFee"
      | "SetProtocolFeeRate"
      | "UpdateERC1155DiscountData"
      | "UpdateTokenDiscountData"
      | "UpdateUserDiscountRate"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "ERC1155DiscountData",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getFeeInfo",
    values: [
      AddressLike,
      BigNumberish,
      AddressLike,
      BigNumberish[],
      BigNumberish[],
      BytesLike
    ]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "protocolFee",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "protocolFeeRate",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "protocolFeeRecipient",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setFeeRecipient",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setProtocolFee",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setProtocolFeeRate",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "tokenDiscountData",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updateERC1155DiscountData",
    values: [AddressLike[], BigNumberish[], IFeeDB.TokenDiscountDataStruct[]]
  ): string;
  encodeFunctionData(
    functionFragment: "updateTokenDiscountData",
    values: [AddressLike[], IFeeDB.TokenDiscountDataStruct[]]
  ): string;
  encodeFunctionData(
    functionFragment: "updateUserDiscountRate",
    values: [AddressLike[], BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "userDiscountRate",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "ERC1155DiscountData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getFeeInfo", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "protocolFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "protocolFeeRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "protocolFeeRecipient",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setFeeRecipient",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setProtocolFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setProtocolFeeRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tokenDiscountData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateERC1155DiscountData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateTokenDiscountData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateUserDiscountRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "userDiscountRate",
    data: BytesLike
  ): Result;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace SetFeeRecipientEvent {
  export type InputTuple = [newRecipient: AddressLike];
  export type OutputTuple = [newRecipient: string];
  export interface OutputObject {
    newRecipient: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace SetProtocolFeeEvent {
  export type InputTuple = [tokenType: BigNumberish, fee: BigNumberish];
  export type OutputTuple = [tokenType: bigint, fee: bigint];
  export interface OutputObject {
    tokenType: bigint;
    fee: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace SetProtocolFeeRateEvent {
  export type InputTuple = [tokenType: BigNumberish, feeRate: BigNumberish];
  export type OutputTuple = [tokenType: bigint, feeRate: bigint];
  export interface OutputObject {
    tokenType: bigint;
    feeRate: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace UpdateERC1155DiscountDataEvent {
  export type InputTuple = [
    token: AddressLike,
    id: BigNumberish,
    holdingAmount: BigNumberish,
    discountRate: BigNumberish
  ];
  export type OutputTuple = [
    token: string,
    id: bigint,
    holdingAmount: bigint,
    discountRate: bigint
  ];
  export interface OutputObject {
    token: string;
    id: bigint;
    holdingAmount: bigint;
    discountRate: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace UpdateTokenDiscountDataEvent {
  export type InputTuple = [
    token: AddressLike,
    holdingAmount: BigNumberish,
    discountRate: BigNumberish
  ];
  export type OutputTuple = [
    token: string,
    holdingAmount: bigint,
    discountRate: bigint
  ];
  export interface OutputObject {
    token: string;
    holdingAmount: bigint;
    discountRate: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace UpdateUserDiscountRateEvent {
  export type InputTuple = [user: AddressLike, discountRate: BigNumberish];
  export type OutputTuple = [user: string, discountRate: bigint];
  export interface OutputObject {
    user: string;
    discountRate: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface FeeDB extends BaseContract {
  connect(runner?: ContractRunner | null): FeeDB;
  waitForDeployment(): Promise<this>;

  interface: FeeDBInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  ERC1155DiscountData: TypedContractMethod<
    [token: AddressLike, id: BigNumberish],
    [IFeeDB.TokenDiscountDataStructOutput],
    "view"
  >;

  getFeeInfo: TypedContractMethod<
    [
      user: AddressLike,
      tokenType: BigNumberish,
      arg2: AddressLike,
      arg3: BigNumberish[],
      amounts: BigNumberish[],
      data: BytesLike
    ],
    [[string, bigint] & { recipient: string; fee: bigint }],
    "view"
  >;

  owner: TypedContractMethod<[], [string], "view">;

  protocolFee: TypedContractMethod<[tokenType: BigNumberish], [bigint], "view">;

  protocolFeeRate: TypedContractMethod<
    [tokenType: BigNumberish],
    [bigint],
    "view"
  >;

  protocolFeeRecipient: TypedContractMethod<[], [string], "view">;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  setFeeRecipient: TypedContractMethod<
    [newRecipient: AddressLike],
    [void],
    "nonpayable"
  >;

  setProtocolFee: TypedContractMethod<
    [tokenType: BigNumberish, fee: BigNumberish],
    [void],
    "nonpayable"
  >;

  setProtocolFeeRate: TypedContractMethod<
    [tokenType: BigNumberish, feeRate: BigNumberish],
    [void],
    "nonpayable"
  >;

  tokenDiscountData: TypedContractMethod<
    [token: AddressLike],
    [IFeeDB.TokenDiscountDataStructOutput],
    "view"
  >;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  updateERC1155DiscountData: TypedContractMethod<
    [
      tokens: AddressLike[],
      ids: BigNumberish[],
      discountData: IFeeDB.TokenDiscountDataStruct[]
    ],
    [void],
    "nonpayable"
  >;

  updateTokenDiscountData: TypedContractMethod<
    [tokens: AddressLike[], discountData: IFeeDB.TokenDiscountDataStruct[]],
    [void],
    "nonpayable"
  >;

  updateUserDiscountRate: TypedContractMethod<
    [users: AddressLike[], discountRates: BigNumberish[]],
    [void],
    "nonpayable"
  >;

  userDiscountRate: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "ERC1155DiscountData"
  ): TypedContractMethod<
    [token: AddressLike, id: BigNumberish],
    [IFeeDB.TokenDiscountDataStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "getFeeInfo"
  ): TypedContractMethod<
    [
      user: AddressLike,
      tokenType: BigNumberish,
      arg2: AddressLike,
      arg3: BigNumberish[],
      amounts: BigNumberish[],
      data: BytesLike
    ],
    [[string, bigint] & { recipient: string; fee: bigint }],
    "view"
  >;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "protocolFee"
  ): TypedContractMethod<[tokenType: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "protocolFeeRate"
  ): TypedContractMethod<[tokenType: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "protocolFeeRecipient"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setFeeRecipient"
  ): TypedContractMethod<[newRecipient: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setProtocolFee"
  ): TypedContractMethod<
    [tokenType: BigNumberish, fee: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setProtocolFeeRate"
  ): TypedContractMethod<
    [tokenType: BigNumberish, feeRate: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "tokenDiscountData"
  ): TypedContractMethod<
    [token: AddressLike],
    [IFeeDB.TokenDiscountDataStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "updateERC1155DiscountData"
  ): TypedContractMethod<
    [
      tokens: AddressLike[],
      ids: BigNumberish[],
      discountData: IFeeDB.TokenDiscountDataStruct[]
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "updateTokenDiscountData"
  ): TypedContractMethod<
    [tokens: AddressLike[], discountData: IFeeDB.TokenDiscountDataStruct[]],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "updateUserDiscountRate"
  ): TypedContractMethod<
    [users: AddressLike[], discountRates: BigNumberish[]],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "userDiscountRate"
  ): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;

  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;
  getEvent(
    key: "SetFeeRecipient"
  ): TypedContractEvent<
    SetFeeRecipientEvent.InputTuple,
    SetFeeRecipientEvent.OutputTuple,
    SetFeeRecipientEvent.OutputObject
  >;
  getEvent(
    key: "SetProtocolFee"
  ): TypedContractEvent<
    SetProtocolFeeEvent.InputTuple,
    SetProtocolFeeEvent.OutputTuple,
    SetProtocolFeeEvent.OutputObject
  >;
  getEvent(
    key: "SetProtocolFeeRate"
  ): TypedContractEvent<
    SetProtocolFeeRateEvent.InputTuple,
    SetProtocolFeeRateEvent.OutputTuple,
    SetProtocolFeeRateEvent.OutputObject
  >;
  getEvent(
    key: "UpdateERC1155DiscountData"
  ): TypedContractEvent<
    UpdateERC1155DiscountDataEvent.InputTuple,
    UpdateERC1155DiscountDataEvent.OutputTuple,
    UpdateERC1155DiscountDataEvent.OutputObject
  >;
  getEvent(
    key: "UpdateTokenDiscountData"
  ): TypedContractEvent<
    UpdateTokenDiscountDataEvent.InputTuple,
    UpdateTokenDiscountDataEvent.OutputTuple,
    UpdateTokenDiscountDataEvent.OutputObject
  >;
  getEvent(
    key: "UpdateUserDiscountRate"
  ): TypedContractEvent<
    UpdateUserDiscountRateEvent.InputTuple,
    UpdateUserDiscountRateEvent.OutputTuple,
    UpdateUserDiscountRateEvent.OutputObject
  >;

  filters: {
    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;

    "SetFeeRecipient(address)": TypedContractEvent<
      SetFeeRecipientEvent.InputTuple,
      SetFeeRecipientEvent.OutputTuple,
      SetFeeRecipientEvent.OutputObject
    >;
    SetFeeRecipient: TypedContractEvent<
      SetFeeRecipientEvent.InputTuple,
      SetFeeRecipientEvent.OutputTuple,
      SetFeeRecipientEvent.OutputObject
    >;

    "SetProtocolFee(uint8,uint256)": TypedContractEvent<
      SetProtocolFeeEvent.InputTuple,
      SetProtocolFeeEvent.OutputTuple,
      SetProtocolFeeEvent.OutputObject
    >;
    SetProtocolFee: TypedContractEvent<
      SetProtocolFeeEvent.InputTuple,
      SetProtocolFeeEvent.OutputTuple,
      SetProtocolFeeEvent.OutputObject
    >;

    "SetProtocolFeeRate(uint8,uint256)": TypedContractEvent<
      SetProtocolFeeRateEvent.InputTuple,
      SetProtocolFeeRateEvent.OutputTuple,
      SetProtocolFeeRateEvent.OutputObject
    >;
    SetProtocolFeeRate: TypedContractEvent<
      SetProtocolFeeRateEvent.InputTuple,
      SetProtocolFeeRateEvent.OutputTuple,
      SetProtocolFeeRateEvent.OutputObject
    >;

    "UpdateERC1155DiscountData(address,uint256,uint256,uint256)": TypedContractEvent<
      UpdateERC1155DiscountDataEvent.InputTuple,
      UpdateERC1155DiscountDataEvent.OutputTuple,
      UpdateERC1155DiscountDataEvent.OutputObject
    >;
    UpdateERC1155DiscountData: TypedContractEvent<
      UpdateERC1155DiscountDataEvent.InputTuple,
      UpdateERC1155DiscountDataEvent.OutputTuple,
      UpdateERC1155DiscountDataEvent.OutputObject
    >;

    "UpdateTokenDiscountData(address,uint256,uint256)": TypedContractEvent<
      UpdateTokenDiscountDataEvent.InputTuple,
      UpdateTokenDiscountDataEvent.OutputTuple,
      UpdateTokenDiscountDataEvent.OutputObject
    >;
    UpdateTokenDiscountData: TypedContractEvent<
      UpdateTokenDiscountDataEvent.InputTuple,
      UpdateTokenDiscountDataEvent.OutputTuple,
      UpdateTokenDiscountDataEvent.OutputObject
    >;

    "UpdateUserDiscountRate(address,uint256)": TypedContractEvent<
      UpdateUserDiscountRateEvent.InputTuple,
      UpdateUserDiscountRateEvent.OutputTuple,
      UpdateUserDiscountRateEvent.OutputObject
    >;
    UpdateUserDiscountRate: TypedContractEvent<
      UpdateUserDiscountRateEvent.InputTuple,
      UpdateUserDiscountRateEvent.OutputTuple,
      UpdateUserDiscountRateEvent.OutputObject
    >;
  };
}