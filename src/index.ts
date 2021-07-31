import express, { Request } from 'express';
import cors from 'cors';

import { IBlock, ITrx } from './types';
import Blockchain from './blockchain';

const app = express();
const ether = new Blockchain();

const port = 8080;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(cors());

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});

app.get('/', (_, res) => {
  res.send('The sedulous hyena ate the antelope!');
});

app.get('/blockchain', (req, res) => {
  res.send(ether);
});

app.get('/mine', (_, res) => {
  const lastBlock: IBlock = ether.getLastBlock();

  const lastBlockHash: string = lastBlock.hash;

  const currentBlockData = {
    transactions: ether.pendingTransactions,
    index: lastBlock['index'] + 1,
  };

  const nonce: number = ether.proofOfWork(lastBlockHash, currentBlockData);
  console.log(nonce, 'nonce');

  const blockHash = ether.hashBlock(lastBlockHash, currentBlockData, nonce);

  ether.createNewTransaction(12.5, '00', 'For miner');

  const newBlock: IBlock = ether.createNewBlock(
    nonce,
    lastBlockHash,
    blockHash,
  );

  res.send({
    note: 'New block mined successfully',
    block: newBlock,
  });
});

app.post('/transaction', (req: Request<{}, {}, ITrx>, res) => {
  const { amount, sender, recipient } = req.body;

  const blockIndex = ether.createNewTransaction(amount, sender, recipient);

  res.send(`Trx will be added in ${blockIndex} block`);
});
