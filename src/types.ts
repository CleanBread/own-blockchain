export interface IBlock {
  index: number;
  timestamp: number;
  transactions: Array<ITrx>;
  nonce: number;
  hash: string;
  previousBlockHash: string;
}

export interface INewTrx {
  amount: string | number;
  sender: string;
  recipient: string;
}

export interface ITrx extends INewTrx {
  transactionId: string;
}

export interface IBlockData {
  transactions: Array<ITrx>;
  index: number;
}

export interface IBlockchain {
  chain: Array<IBlock>;
  pendingTransactions: Array<ITrx>;
  currentNodeUrl: string;
  networkNodes: Array<string>;
}
