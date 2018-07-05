import Blockchain from "../domain/Blockchain"
import test from "ava"

export default () => {
  const blockchain = new Blockchain("DUMMIE_ID", {broadcastTransaction: () => {}, broadcastBlock: () => {}})

  test("Creating a new block without transactions, expecting 2 blocks and the last has no transaction.", t => {
    blockchain.createBlock()
    const chain = blockchain.getChain()
    t.is(chain.length, 2)
    t.is(chain[1].index, 2)
    t.is(chain[1].transactions.length, 0)
    const pedingTransactions = blockchain.getPendingTransactions()
    t.is(pedingTransactions.length, 0)
    t.is(chain[1].transactions.length, 0)
    t.not(chain[1].nonce, 0)
    t.is(chain[1].previousBlockHash, "0")
    t.is(chain[1].hash.substring(0,4), "0000")
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
    blockchain.createBlock()
    const chain = blockchain.getChain()
    t.is(chain.length, 3)
    t.is(chain[2].index, 3)
    t.not(chain[2].nonce, 0)
    t.not(chain[2].previousBlockHash, "0")
    t.is(chain[2].hash.substring(0,4), "0000")
    t.is(chain[2].transactions.length, 2)
    const pedingTransactions = blockchain.getPendingTransactions()
    t.is(pedingTransactions.length, 0)
  })

  test("Proof of work, expecting returning 33601 as nonce.", t => {
    const block = {index: 0, timestamp: 0, transactions: [], previousBlockHash: "0INA90SDNF90N"}
    const nonce = blockchain.proofOfWork(block)
    t.is(nonce, 59443)
  })

  test("Hashing block, expecting new hash starting with 0000.", t => {
    const block = {index: 0, timestamp: 0, transactions: [], previousBlockHash: "0INA90SDNF90N", nonce: 59443}
    const hash = blockchain.hashBlock(block)
    t.is(hash.substring(0,4), "0000")
  })

  test("Mining, expecting succeed.", async t => {
    const lastBlock = await blockchain.mine()
    const previousBlock = blockchain.getChain()[blockchain.getChain().length - 2]
    const pedingTransactions = blockchain.getPendingTransactions()
    t.is(lastBlock.index, 4)
    t.is(lastBlock.hash.substring(0,4), "0000")
    t.not(lastBlock.nonce, 0)
    t.is(lastBlock.previousBlockHash, previousBlock.hash)
    t.is(lastBlock.transactions.length, 0)
    t.is(pedingTransactions.length, 1)
    t.is(pedingTransactions[0].amount, 12.5)
    t.is(pedingTransactions[0].sender, "00")
  })

  test("Creating and broadcast a new block, expecting 5 blocks and empty pending transactions.", async t => {
    const lastBlock = await blockchain.createAndBroadcastBlock()
    const previousBlock = blockchain.getChain()[blockchain.getChain().length - 2]
    const chain = blockchain.getChain()
    t.is(chain.length, 5)
    t.is(lastBlock.index, 5)
    t.not(lastBlock.nonce, 0)
    t.is(lastBlock.previousBlockHash, previousBlock.hash)
    t.is(lastBlock.hash.substring(0,4), "0000")
    t.is(lastBlock.transactions.length, 1)
    t.is(lastBlock.transactions[0].amount, 12.5)
    t.is(lastBlock.transactions[0].sender, "00")
    const pedingTransactions = blockchain.getPendingTransactions()
    t.is(pedingTransactions.length, 0)
  })

  test("Validate a receiving new block, succeed expected.", t => {
    const lastBlock = blockchain.getLastBlock()
    const transactions = [{transactionId: "NEW_TRANSACTION", amount: 100, sender: "NEW_SENDER", recipient: "NEW_RECIPIENT"}]
    const block = {index: 6, timestamp: Date.now(), previousBlockHash: lastBlock.hash, transactions}
    block.nonce = blockchain.proofOfWork(block)
    block.hash = blockchain.hashBlock(block)
    blockchain.receiveBlock(block)
    const chain = blockchain.getChain()
    t.is(chain.length, 6)
    t.is(chain[5].index, 6)
    t.is(chain[5].previousBlockHash, block.previousBlockHash)
    t.is(chain[5].hash, block.hash)
  })

  test("Validate a receiving new block, expecting an error.", t => {
    const block = { index: 6, hash: "BLABLABLA", previousBlockHash: "DUMMIE_PREVIOUS", transactions: [] }
    
    const error = t.throws(() => {
      blockchain.receiveBlock(block)
    }, Error)
  
    t.is(error.message, "Invalid block")
  })

  test("Getting a block by hash, expecting null return.", t => {
    const block = blockchain.getBlock("asdasdasd")
    t.is(block, null)
  })

  test("Getting a block by hash, expecting a return.", t => {
    const hash = blockchain.getLastBlock().hash
    const block = blockchain.getBlock(hash)
    t.is(block.index, 6)
  })

  test("Getting a transaction by id, expecting null return.", t => {
    const transaction = blockchain.getTransaction("gcfhgfhgfgh")
    t.is(transaction, null)
  })

  test("Getting a transaction by id, expecting a return.", t => {
    const res = blockchain.getTransaction("NEW_TRANSACTION")
    t.is(res.transaction.transactionId, "NEW_TRANSACTION")
    t.is(res.transaction.amount, 100)
    t.is(res.transaction.sender, "NEW_SENDER")
    t.is(res.transaction.recipient, "NEW_RECIPIENT")
  })

  test("Getting a balance by address, expecting a return.", t => {
    const balance = blockchain.getBalanceByAddress("RECIPIENT_3")
    t.is(balance.transactions.length, 1)
    t.is(balance.transactions[0].amount, 100)
    t.is(balance.transactions[0].sender, "SENDER_2")
    t.is(balance.transactions[0].recipient, "RECIPIENT_3")
    t.is(balance.outcome, 0)
    t.is(balance.income, 100)
    t.is(balance.total, 100)
  })

  test("Getting a balance by address, expecting empty return.", t => {
    const balance = blockchain.getBalanceByAddress("blablabla")
    t.is(balance, null)
  })
}