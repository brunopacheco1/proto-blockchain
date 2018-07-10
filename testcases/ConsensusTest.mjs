import Blockchain from "../app/domain/Blockchain"
import test from "ava"

export default () => {
  test("Running consensus, expecting no changes from a invalid chain.", async t => {
    const blockchain = new Blockchain({getNodeUrl: () => "NODE_URL", getChainsFromNodes:() => [{
      _pendingTransactions: [{
        index: 3,
        transactions: [{amount: 12.5, sender: "00",recipient: "9ab18a507f8311e8a22173c03004a307",transactionId: "63db0ce07f8811e8a22173c03004a307"}],
        timestamp: 1530708459940,
        nonce: 141645,
        hash: "00003352b71263f889b3e61cacde4c0b67e71ba737ff56f1f43a14d7f09774b0",
        previousBlockHash: "0000f2e14cfec1124301c50f6b565309ad1c42eca758f9b7faa17d2085b045c7"
      }],
      _chain: [
        {index: 1,transactions: [],timestamp: 1530706384766,nonce: 1000,hash: "0",previousBlockHash: "0"},
        {index: 2,transactions: [],timestamp: 1530708440201,nonce: 153012,hash: "0000f2e14cfec1124301c50f6b565309ad1c42eca758f9b7faa17d2085b045c7",previousBlockHash: "0"},
        {
          index: 3,
          transactions: [{amount: 12.5, sender: "00",recipient: "9ab18a507f8311e8a22173c03004a307",transactionId: "63db0ce07f8811e8a22173c03004a307"}],
          timestamp: 1530708459940,
          nonce: 141645,
          hash: "00003352b71263f889b3e61cacde4c0b67e71ba737ff56f1f43a14d7f09774b0",
          previousBlockHash: "0000f2e14cfec1124301c50f6b565309ad1c42eca758f9b7faa17d2085b045c7"
        },
        {
          index: 4,
          transactions: [{amount: 12.5,sender: "00",recipient: "9a9aa6f07f8311e88ac14187a5dbb86b",transactionId: "6f9efb907f8811e88ac14187a5dbb86b"}],
          timestamp: 1530708465660,
          nonce: 35384,
          hash: "00004bd08dd79b5d2f10fdbc3c6b0ca0e41198ce56ed9342352f55cbdd522ac4",
          previousBlockHash: "00003352b71263f889b3e61cacde4c0b67e71ba737ff56f1f43a14d7f09774b0"
        },
        {
          index: 5,
          transactions: [{amount: 12.5,sender: "00",recipient: "9ad231b07f8311e8abbe613d30b64294",transactionId: "730753e07f8811e8abbe613d30b64294"}],
          timestamp: 1530708469279,
          nonce: 37274,
          hash: "0000e98212e5b2eea099cc74d4fa0229dcbe8715e207732b39644a7de3490b4d",
          previousBlockHash: "00004bd08dd79b5d2f10fdbc3c6b0ca0e41198ce56ed9342352f55cbdd522ac4"
        }
      ]
    }]})

    const prevChainLength = blockchain.getChain().length
    const prevPendingTransactionsLength = blockchain.getPendingTransactions().length
    await blockchain.runConsensus()
    t.is(prevChainLength, blockchain.getChain().length)
    t.is(prevPendingTransactionsLength, blockchain.getPendingTransactions().length)
  })

  test("Running consensus, expecting changes from a valid chain.", async t => {
    const blockchain = new Blockchain({getNodeUrl: () => "NODE_URL", getChainsFromNodes:() => [{
      _pendingTransactions: [{
        index: 3,
        transactions: [{amount: 12.5, sender: "00",recipient: "9ab18a507f8311e8a22173c03004a307",transactionId: "63db0ce07f8811e8a22173c03004a307"}],
        timestamp: 1530708459940,
        nonce: 141645,
        hash: "00003352b71263f889b3e61cacde4c0b67e71ba737ff56f1f43a14d7f09774b0",
        previousBlockHash: "0000f2e14cfec1124301c50f6b565309ad1c42eca758f9b7faa17d2085b045c7"
      }],
      _chain: [
        {
          index: 1,
          transactions: [],
          timestamp: 1530794613677,
          previousBlockHash: "0",
          hash: "0",
          nonce: 100
        },
        {
          index: 2,
          transactions: [],
          timestamp: 1530794627195,
          previousBlockHash: "0",
          nonce: 19481,
          hash: "00003858510f18b2c099bc084fd42a8b5c234f1b0c05ff91cb41179c2f7c90c7"
        },
        {
          index: 3,
          transactions: [{amount: 12.5, sender: "00", recipient: "07396b70805111e8977a31b2b417a618", transactionId: "0f6f9f80805111e8977a31b2b417a618"}],
          timestamp: 1530794628384,
          previousBlockHash: "00003858510f18b2c099bc084fd42a8b5c234f1b0c05ff91cb41179c2f7c90c7",
          nonce: 91281,
          hash: "0000f600604d972cfefd515f8d3d25a67b1f9614d4b1ce52743e8d8a2bf5b83b"
        },
        {
          index: 4,
          transactions: [{amount: 12.5, sender: "00", recipient: "07396b70805111e8977a31b2b417a618", transactionId: "10924d90805111e8977a31b2b417a618"}],
          timestamp: 1530794634519,
          previousBlockHash: "0000f600604d972cfefd515f8d3d25a67b1f9614d4b1ce52743e8d8a2bf5b83b",
          nonce: 95395,
          hash: "0000fd38bb0302d5b4b82553b127aa73645004b910eb1d580e7c17ced8e56920"
        },
        {
          index: 5,
          transactions: [{amount: 12.5,sender: "00", recipient: "07396b70805111e8977a31b2b417a618", transactionId: "1430d110805111e8977a31b2b417a618"}],
          timestamp: 1530794636731,
          previousBlockHash: "0000fd38bb0302d5b4b82553b127aa73645004b910eb1d580e7c17ced8e56920",
          nonce: 32492,
          hash: "0000d228ed749469331cc4a26bdc033be8f98562872a0338cfc2b74d889ebcbf"
        }
      ]
    }]})

    const prevChainLength = blockchain.getChain().length
    const prevPendingTransactionsLength = blockchain.getPendingTransactions().length
    await blockchain.runConsensus()
    t.not(prevChainLength, blockchain.getChain().length)
    t.not(prevPendingTransactionsLength, blockchain.getPendingTransactions().length)
  })
}