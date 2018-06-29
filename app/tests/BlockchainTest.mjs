import Blockchain from "../domain/Blockchain"
import test from "ava"

export default () => {
  const mycoin = new Blockchain()

  test("Creating a new block in the blockchain without transactions.", t => {
    const nonce = 2389
    const previousBlockHash = "0INA90SDNF90N"
    const hash = "90ANSD9F0N9009N"
    mycoin.createBlock(nonce, previousBlockHash, hash)
    const chain = mycoin.getChain()
    t.is(chain.length, 1)
    t.is(chain[0].index, 1)
    t.is(chain[0].nonce, nonce)
    t.is(chain[0].previousBlockHash, previousBlockHash)
    t.is(chain[0].hash, hash)
    const pedingTransactions = mycoin.getPendingTransactions()
    t.is(pedingTransactions.length, 0)
    t.is(chain[0].transactions.length, 0)
  })

  test("Creating a new transaction in the blockchain.", t => {
    const amount = 100
    const sender = "SENDER_1"
    const recipient = "RECIPIENT_2"
    const blockIndex = mycoin.createTransaction(amount, sender, recipient)
    const pedingTransactions = mycoin.getPendingTransactions()
    t.is(pedingTransactions.length, 1)
    t.is(pedingTransactions[0].sender, sender)
    t.is(pedingTransactions[0].recipient, recipient)
    t.is(pedingTransactions[0].amount, amount)
    t.is(blockIndex, 2)
  })
  
  test("Creating a new block in the blockchain with transactions.", t => {
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
    t.is(chain[1].transactions.length, 1)
  })
}