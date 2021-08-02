export interface IBlock {
  index: number;
  timestamp: number;
  transactions: Array<any>;
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
