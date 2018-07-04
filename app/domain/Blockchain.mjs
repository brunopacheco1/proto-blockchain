import crypto from "crypto"
import uuid from "uuid/v1"

export default class Blochain {
  
  constructor(nodeId, network) {
    this._nodeId=nodeId
    this._chain=[]
    this._pendingTransactions=[]
    this._network=network
    this.createBlock(100, "0", "0")//Genesis block
  }

  mine() {
    const lastBlock = this._getLastBlock()
    const previousBlockHash = lastBlock.hash
    const currentBlockData = this._buildBlockData()
    const nonce = this.proofOfWork(previousBlockHash, currentBlockData)
    const hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
    this.createTransaction(12.5, "00", this._nodeId)
    this.createBlock(nonce, previousBlockHash, hash)
    return this._getLastBlock()
  }

  createBlock(nonce, previousBlockHash, hash) {
    const newBlock = this._buildBlock(nonce, previousBlockHash, hash)
    this._pendingTransactions=[]
    this._chain.push(newBlock)
  }

  _buildBlock(nonce, previousBlockHash, hash) {
    const block = this._buildBlockData()
    block.timestamp = Date.now()
    block.nonce = nonce
    block.hash = hash
    block.previousBlockHash = previousBlockHash
    return block
  }

  _buildBlockData() {
    return {
      index: this._getCurrentIndex(), transactions: this._pendingTransactions
    }
  }

  getChain() {
    return this._chain
  }

  createTransaction(amount, sender, recipient, transactionId) {
    const newTransactionId = transactionId || uuid().split("-").join("")
    const newTransaction = {amount, sender, recipient, transactionId: newTransactionId}
    this._pendingTransactions.push(newTransaction)
    return [this._getCurrentIndex(), newTransaction]
  }

  createAndBroadcastTransaction(amount, sender, recipient) {
    const [blockIndex, newTransaction] = this.createTransaction(amount, sender, recipient)
    this._network.broadcastTransaction(newTransaction)
    return [blockIndex, newTransaction]
  }

  getPendingTransactions() {
    return this._pendingTransactions
  }

  _getLastBlock() {
    return this._chain[this._chain.length - 1]
  }

  _getCurrentIndex() {
    return this._chain.length + 1
  }
  
  hashBlock(previousBlockHash, currentBlockData, nonce) {
    const toHash = previousBlockHash + nonce + JSON.stringify(currentBlockData)
    return this._hash(toHash)
  }

  proofOfWork(previousBlockHash, currentBlockData) {
    let nonce = 0
    while(!this.hashBlock(previousBlockHash, currentBlockData, nonce).startsWith("0000")) nonce++
    return nonce
  }

  _hash(message) {
    const secret = "MY_SECRET"
    return crypto.createHmac("sha256", secret).update(message).digest("hex")
  }
}