import Rekv from 'rekv';

const store = new Rekv({
  balance: { free: '0 NMT' },
  nonce: -1,
});

export default store;
