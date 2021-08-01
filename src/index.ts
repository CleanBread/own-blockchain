import express, { Request } from 'express';
import cors from 'cors';
import axios from 'axios';

import { IBlock, ITrx } from './types';
import Blockchain from './blockchain';

const app = express();

const currentNodeUrl: string = process.argv[3];

const ether = new Blockchain(currentNodeUrl);

const port = process.argv[2] || 8080;

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

app.post(
  '/register-and-broadcast-node',
  (req: Request<{}, {}, { newNodeUrl: string }>, res) => {
    const newNodeUrl: string = req.body.newNodeUrl;

    if (
      !ether.netNodes.includes(newNodeUrl) &&
      ether.currentNodeUrl !== newNodeUrl
    ) {
      if (ether.netNodes.length) {
        const regNodesPromises: Array<Promise<any>> = [];

        ether.netNodes.forEach((netNode) => {
          regNodesPromises.push(
            axios.post(`${netNode}/register-node`, {
              newNodeUrl,
            }),
          );
        });

        Promise.all(regNodesPromises)
          .then((data: any) => {
            axios
              .post(`${newNodeUrl}/register-node-bulk`, {
                allNetNodes: [...ether.netNodes, ether.currentNodeUrl],
              })
              .then(() => {})
              .catch(() => console.log('err register-node-bulk'));

            ether.addNewNetworkNode(newNodeUrl);

            res.send(`Node ${req.body.newNodeUrl} was added`);
          })
          .catch(() => {
            console.log('err register-node');
          });
      } else {
        axios
          .post(`${newNodeUrl}/register-node-bulk`, {
            allNetNodes: [...ether.netNodes, ether.currentNodeUrl],
          })
          .then(() => {})
          .catch(() => console.log('err register-node-bulk'));

        ether.addNewNetworkNode(newNodeUrl);

        res.send(`Node ${req.body.newNodeUrl} was added`);
      }
    } else {
      res.send('Node already added');
    }
  },
);

app.post(
  '/register-node',
  (req: Request<{}, {}, { newNodeUrl: string }>, res) => {
    ether.addNewNetworkNode(req.body.newNodeUrl);

    res.send('Ok register-node');
  },
);

app.post(
  '/register-node-bulk',
  (req: Request<{}, {}, { allNetNodes: Array<string> }>, res) => {
    ether.netNodes = req.body.allNetNodes;

    res.send('Ok register-node-bulk');
  },
);
