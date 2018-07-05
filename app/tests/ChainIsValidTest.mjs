import Blockchain from "../domain/Blockchain"
import test from "ava"

export default () => {
  const blockchain = new Blockchain("DUMMIE_ID", {})

  test("Validating a chain, expecting not valid chain as previous hash is not the expected.", t => {
    const chain = [
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
        previousBlockHash: "00000",
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
    
    t.false(blockchain.chainIsValid(chain))
  })

  test("Validating a chain, expecting not valid chain as hash is invalid.", t => {
    const chain = [
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
        hash: "0000_invalid_hash"
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
    
    t.false(blockchain.chainIsValid(chain))
  })

  test("Validating a chain, expecting not valid chain as genesis block is diferent.", t => {
    const chain = [
      {
        index: 1,
        transactions: [],
        timestamp: 1530794613677,
        previousBlockHash: "0",
        hash: "0",
        nonce: 1000
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
    
    t.false(blockchain.chainIsValid(chain))
  })

  test("Validating a chain, succeed expected.", t => {
    const chain = [
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
    
    t.true(blockchain.chainIsValid(chain))
  })
}