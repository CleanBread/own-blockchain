import sha256 from 'sha256';
import { v4 as uuid } from 'uuid';

import { IBlock, ITrx } from './types';

class Blockchain {
  public chain: Array<IBlock>;

  public pendingTransactions: Array<ITrx>;

  public currentNodeUrl: string;

  private networkNodes: Array<string>;

  constructor(currentNodeUrl: string) {
    this.chain = [];

    this.pendingTransactions = [];

    this.currentNodeUrl = currentNodeUrl;

    this.networkNodes = [];

    this.createNewBlock(100, '0', '0');
  }

  set netNodes(newNodes: Array<string>) {
    if (!newNodes.includes(this.currentNodeUrl)) {
      this.networkNodes = newNodes;
    }
  }

  get netNodes(): Array<string> {
    return this.networkNodes;
  }

  addNewNetworkNode(netNode: string): void {
    if (
      !this.networkNodes.includes(netNode) &&
      this.currentNodeUrl !== netNode
    ) {
      this.networkNodes.push(netNode);
    }
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
  ): ITrx {
    const newTrx: ITrx = {
      amount,
      sender,
      recipient,
      transactionId: uuid().split('-').join(''),
    };

    return newTrx;
  }

  addTransactionToPendingTransactions(tx: ITrx): number {
    this.pendingTransactions.push(tx);

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
