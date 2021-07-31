import sha256 from 'sha256';

import { IBlock, ITrx } from './types';

class Blockchain {
  public chain: Array<IBlock>;
  public pendingTransactions: Array<ITrx>;

  constructor() {
    this.chain = [];
    this.pendingTransactions = [];

    this.createNewBlock(100, '0', '0');
  }

  createNewBlock(
    nonce: number,
    previousBlockHash: string,
    hash: string,
  ): IBlock {
    const newBlock: IBlock = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.pendingTransactions,
      nonce,
      hash,
      previousBlockHash,
    };

    this.pendingTransactions = [];
    this.chain.push(newBlock);

    return newBlock;
  }

  getLastBlock(): IBlock {
    return this.chain[this.chain.length - 1];
  }

  createNewTransaction(
    amount: number | string,
    sender: string,
    recipient: string,
  ): number {
    const newTrx: ITrx = {
      amount,
      sender,
      recipient,
    };

    this.pendingTransactions.push(newTrx);

    return this.getLastBlock()['index'] + 1;
  }

  hashBlock(
    previousBlockHash: string,
    currentBlockData: any,
    nonce: number,
  ): string {
    return sha256(
      `${previousBlockHash}${nonce}${JSON.stringify(currentBlockData)}`,
    );
  }

  proofOfWork(previousBlockHash: string, currentBlockData: any): number {
    let nonce = 0;

    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);

    while (hash.substring(0, 4) !== '0000') {
      nonce += 1;
      hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    }

    return nonce;
  }
}

export default Blockchain;
