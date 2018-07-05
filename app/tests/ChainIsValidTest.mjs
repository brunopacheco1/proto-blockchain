import Blockchain from "../domain/Blockchain"
import test from "ava"

export default () => {
  const blockchain = new Blockchain("DUMMIE_ID", {})

  test("Validating a chain, expecting not valid chain as previous hash is not the expected.", t => {
    let chain = [
      {index: 1,transactions: [],timestamp: 1530706384766,nonce: 100,hash: "0",previousBlockHash: "0"},
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
        previousBlockHash: "sdfsdfsdf"
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
    
    t.false(blockchain.chainIsValid(chain))
  })

  test("Validating a chain, expecting not valid chain as genesis block is diferent.", t => {
    const chain = [
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
    
    t.false(blockchain.chainIsValid(chain))
  })

  test("Validating a chain, succeed expected.", t => {
    const chain = [
      {index: 1,transactions: [],timestamp: 1530706384766,nonce: 100,hash: "0",previousBlockHash: "0"},
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
    
    t.true(blockchain.chainIsValid(chain))
  })
}