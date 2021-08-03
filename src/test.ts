import Blockchain from './blockchain';

const bc = new Blockchain('');

const isValid = bc.chainIsValid([
  {
    index: 1,
    timestamp: 1627981421742,
    transactions: [],
    nonce: 100,
    hash: '0',
    previousBlockHash: '0',
  },
  {
    index: 2,
    timestamp: 1627981432486,
    transactions: [
      {
        amount: 10,
        sender: 'Gleb',
        recipient: 'Hleb',
        transactionId: '4a08879da7f042b7bf6a315fef1ee6a6',
      },
    ],
    nonce: 6146,
    hash: '0000d50c72eb10a03d02766a6fd91fdf5a1612c90575a56feb5d70b4084c23e8',
    previousBlockHash: '0',
  },
  {
    index: 3,
    timestamp: 1627981446339,
    transactions: [
      {
        amount: 12.5,
        sender: '00',
        recipient: 'For miner',
        transactionId: '3e2902b2d18840f3b3defb400ba381eb',
      },
      {
        amount: 100,
        sender: 'Gleb',
        recipient: 'Hleb',
        transactionId: 'a6bbbb6e855c456299db38ccee019271',
      },
    ],
    nonce: 6037,
    hash: '00005d0cd4236c35392c4054f82bfb5c1b2174adcd8fdbf83e77cc805147a831',
    previousBlockHash:
      '0000d50c72eb10a03d02766a6fd91fdf5a1612c90575a56feb5d70b4084c23e8',
  },
]);

console.log(isValid);
