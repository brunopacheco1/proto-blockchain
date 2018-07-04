import Blockchain from "../domain/Blockchain"
import test from "ava"

export default () => {
  const mycoin = new Blockchain("DUMMIE_ID", {broadcastTransaction: () => {}})

  test("Creating a new block without transactions, expecting 2 blocks and the last has no transaction.", t => {
    const nonce = 2389
    const previousBlockHash = "0INA90SDNF90N"
    const hash = "90ANSD9F0N9009N"
    mycoin.createBlock(nonce, previousBlockHash, hash)
    const chain = mycoin.getChain()
    t.is(chain.length, 2)
    t.is(chain[1].index, 2)
    t.is(chain[1].nonce, nonce)
    t.is(chain[1].previousBlockHash, previousBlockHash)
    t.is(chain[1].hash, hash)
    const pedingTransactions = mycoin.getPendingTransactions()
    t.is(pedingTransactions.length, 0)
    t.is(chain[1].transactions.length, 0)
  })

  test("Creating a new transaction, expecting one pending transaction.", t => {
    const amount = 100
    const sender = "SENDER_1"
    const recipient = "RECIPIENT_2"
    const [blockIndex, newTransaction] = mycoin.createTransaction(amount, sender, recipient)
    t.is(blockIndex, 3)
    const pendingTransactions = mycoin.getPendingTransactions()
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

  test("Creating and broadcasting a new transaction, expecting one new pending transaction.", t => {
    const amount = 100
    const sender = "SENDER_2"
    const recipient = "RECIPIENT_3"
    const [blockIndex, newTransaction] = mycoin.createAndBroadcastTransaction(amount, sender, recipient)
    const pendingTransactions = mycoin.getPendingTransactions()
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
    mycoin.createBlock(nonce, previousBlockHash, hash)
    const chain = mycoin.getChain()
    t.is(chain.length, 3)
    t.is(chain[2].index, 3)
    t.is(chain[2].nonce, nonce)
    t.is(chain[2].previousBlockHash, previousBlockHash)
    t.is(chain[2].hash, hash)
    t.is(chain[2].transactions.length, 2)
    const pedingTransactions = mycoin.getPendingTransactions()
    t.is(pedingTransactions.length, 0)
  })

  test("Hashing block, expecting new hash starting with 0000.", t => {
    const nonce = 33601
    const previousBlockHash = "0INA90SDNF90N"
    const currentBlockData = {index: 0, timestamp: 0, transactions: []}
    const hash = mycoin.hashBlock(previousBlockHash, currentBlockData, nonce)
    t.is(hash.substring(0,4), "0000")
  })

  test("Proof of work, expecting returning 33601 as nonce.", t => {
    const previousBlockHash = "0INA90SDNF90N"
    const currentBlockData = {index: 0, timestamp: 0, transactions: []}
    const nonce = mycoin.proofOfWork(previousBlockHash, currentBlockData)
    t.is(nonce, 33601)
  })

  test("Mining, expecting succeed.", t => {
    const lastBlock = mycoin.mine()
    t.is(lastBlock.index, 4)
    t.is(lastBlock.hash.substring(0,4), "0000")
    t.not(lastBlock.nonce, 0)
    t.is(lastBlock.previousBlockHash, "90ANSD9F0N9009N")
    t.is(lastBlock.transactions.length, 1)
    t.is(lastBlock.transactions[0].amount, 12.5)
    t.is(lastBlock.transactions[0].sender, "00")
  })
}