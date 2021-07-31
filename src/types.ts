export interface IBlock {
  index: number;
  timestamp: number;
  transactions: Array<any>;
  nonce: number;
  hash: string;
  previousBlockHash: string;
}

export interface ITrx {
  amount: string | number;
  sender: string;
  recipient: string;
}
