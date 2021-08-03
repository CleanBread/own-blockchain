import sha256 from 'sha256';
import { v4 as uuid } from 'uuid';

import { IBlock, ITrx, IBlockData } from './types';

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
    currentBlockData: IBlockData,
    nonce: number,
  ): string {
    return sha256(
      `${previousBlockHash}${nonce}${JSON.stringify(currentBlockData)}`,
    );
  }

  proofOfWork(previousBlockHash: string, currentBlockData: IBlockData): number {
    let nonce = 0;

    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);

    while (hash.substring(0, 4) !== '0000') {
      nonce += 1;
      hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    }

    return nonce;
  }

  chainIsValid(blockchain: Array<IBlock>): boolean {
    let validChain: boolean = true;

    for (let i = 1; i < blockchain.length; i++) {
      const currentBlock = blockchain[i];
      const prevBlock = blockchain[i - 1];
      const blockHash = this.hashBlock(
        prevBlock.hash,
        {
          transactions: currentBlock.transactions,
          index: currentBlock.index,
        },
        currentBlock.nonce,
      );
      const genesisBlock = blockchain[0];

      if (
        genesisBlock.nonce !== 100 ||
        genesisBlock.previousBlockHash !== '0' ||
        genesisBlock.hash !== '0' ||
        genesisBlock.transactions.length
      ) {
        validChain = false;
        break;
      }

      if (
        blockHash.substring(0, 4) !== '0000' ||
        currentBlock.previousBlockHash !== prevBlock.hash
      ) {
        validChain = false;
        break;
      }
    }

    return validChain;
  }
}

export default Blockchain;
