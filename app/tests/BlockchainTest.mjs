import Blockchain from "../domain/Blockchain"
import test from "ava"

export default () => {
  const blockchain = new Blockchain("DUMMIE_ID", {broadcastTransaction: () => {}, broadcastBlock: () => {}})

  test("Creating a new block without transactions, expecting 2 blocks and the last has no transaction.", t => {
    const nonce = 2389
    const previousBlockHash = "0INA90SDNF90N"
    const hash = "90ANSD9F0N9009N"
    blockchain.createBlock(nonce, previousBlockHash, hash)
    const chain = blockchain.getChain()
    t.is(chain.length, 2)
    t.is(chain[1].index, 2)
    t.is(chain[1].nonce, nonce)
    t.is(chain[1].previousBlockHash, previousBlockHash)
    t.is(chain[1].hash, hash)
    const pedingTransactions = blockchain.getPendingTransactions()
    t.is(pedingTransactions.length, 0)
    t.is(chain[1].transactions.length, 0)
  })

  test("Creating a new transaction, expecting one pending transaction.", t => {
    const amount = 100
    const sender = "SENDER_1"
    const recipient = "RECIPIENT_2"
    const [blockIndex, newTransaction] = blockchain.createTransaction(amount, sender, recipient)
    t.is(blockIndex, 3)
    const pendingTransactions = blockchain.getPendingTransactions()
    t.is(pendingTransactions.length, 1)
    t.is(pendingTransactions[0].sender, sender)
    t.is(pendingTransactions[0].recipient, recipient)
    t.is(pendingTransactions[0].amount, amount)
    t.regex(pendingTransactions[0].transactionId, /.+/)
    t.is(newTransaction.sender, pendingTransactions[0].sender)
    t.is(newTransaction.recipient, pendingTransactions[0].recipient)
    t.is(newTransaction.amount, pendingTransactions[0].amount)
    t.is(newTransaction.transactionId, pendingTransactions[0].transactionId)
  })

  test("Creating and broadcasting a new transaction, expecting one new pending transaction.", async t => {
    const amount = 100
    const sender = "SENDER_2"
    const recipient = "RECIPIENT_3"
    const [blockIndex, newTransaction] = await blockchain.createAndBroadcastTransaction(amount, sender, recipient)
    const pendingTransactions = blockchain.getPendingTransactions()
    t.is(blockIndex, 3)
    t.is(pendingTransactions.length, 2)
    t.is(pendingTransactions[1].sender, sender)
    t.is(pendingTransactions[1].recipient, recipient)
    t.is(pendingTransactions[1].amount, amount)
    t.regex(pendingTransactions[1].transactionId, /.+/)
    t.is(newTransaction.sender, pendingTransactions[1].sender)
    t.is(newTransaction.recipient, pendingTransactions[1].recipient)
    t.is(newTransaction.amount, pendingTransactions[1].amount)
    t.is(newTransaction.transactionId, pendingTransactions[1].transactionId)
  })
  
  test("Creating a new block, expecting 3 blocks and the last with two transactions.", t => {
    const nonce = 2389
    const previousBlockHash = "0INA90SDNF90N"
    const hash = "90ANSD9F0N9009N"
    blockchain.createBlock(nonce, previousBlockHash, hash)
    const chain = blockchain.getChain()
    t.is(chain.length, 3)
    t.is(chain[2].index, 3)
    t.is(chain[2].nonce, nonce)
    t.is(chain[2].previousBlockHash, previousBlockHash)
    t.is(chain[2].hash, hash)
    t.is(chain[2].transactions.length, 2)
    const pedingTransactions = blockchain.getPendingTransactions()
    t.is(pedingTransactions.length, 0)
  })

  test("Hashing block, expecting new hash starting with 0000.", t => {
    const nonce = 33601
    const previousBlockHash = "0INA90SDNF90N"
    const currentBlockData = {index: 0, timestamp: 0, transactions: []}
    const hash = blockchain.hashBlock(previousBlockHash, currentBlockData, nonce)
    t.is(hash.substring(0,4), "0000")
  })

  test("Proof of work, expecting returning 33601 as nonce.", t => {
    const previousBlockHash = "0INA90SDNF90N"
    const currentBlockData = {index: 0, timestamp: 0, transactions: []}
    const nonce = blockchain.proofOfWork(previousBlockHash, currentBlockData)
    t.is(nonce, 33601)
  })

  test("Mining, expecting succeed.", async t => {
    const lastBlock = await blockchain.mine()
    const pedingTransactions = blockchain.getPendingTransactions()
    t.is(lastBlock.index, 4)
    t.is(lastBlock.hash.substring(0,4), "0000")
    t.not(lastBlock.nonce, 0)
    t.is(lastBlock.previousBlockHash, "90ANSD9F0N9009N")
    t.is(lastBlock.transactions.length, 0)
    t.is(pedingTransactions.length, 1)
    t.is(pedingTransactions[0].amount, 12.5)
    t.is(pedingTransactions[0].sender, "00")
  })

  test("Creating and broadcast a new block, expecting 5 blocks and empty pending transactions.", async t => {
    const nonce = 2389
    const previousBlockHash = "0INA90SDNF90N"
    const hash = "90ANSD9F0N9009N"
    await blockchain.createAndBroadcastBlock(nonce, previousBlockHash, hash)
    const chain = blockchain.getChain()
    t.is(chain.length, 5)
    t.is(chain[4].index, 5)
    t.is(chain[4].nonce, nonce)
    t.is(chain[4].previousBlockHash, previousBlockHash)
    t.is(chain[4].hash, hash)
    t.is(chain[4].transactions.length, 1)
    t.is(chain[4].transactions[0].amount, 12.5)
    t.is(chain[4].transactions[0].sender, "00")
    const pedingTransactions = blockchain.getPendingTransactions()
    t.is(pedingTransactions.length, 0)
  })

  test("Validate a receiving new block, succeed expected.", async t => {
    const block = { index: 6, hash: "90ANSD9F0N9009NAS", previousBlockHash: "90ANSD9F0N9009N" }
    blockchain.receiveBlock(block)
    const chain = blockchain.getChain()
    t.is(chain.length, 6)
    t.is(chain[5].index, 6)
    t.is(chain[5].previousBlockHash, block.previousBlockHash)
    t.is(chain[5].hash, block.hash)
  })

  test("Validate a receiving new block, expecting an error.", async t => {
    const block = { index: 6, hash: "BLABLABLA", previousBlockHash: "DUMMIE_PREVIOUS" }
    
    const error = t.throws(() => {
      blockchain.receiveBlock(block)
    }, Error);
  
    t.is(error.message, "Invalid block");
  })

  test("Validate a chain, expecting not valid chain.", t => {
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

    chain = [
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

  test("Validate a chain, succeed expected.", t => {
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