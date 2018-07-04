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

  async mine() {
    const lastBlock = this._getLastBlock()
    const previousBlockHash = lastBlock.hash
    const currentBlockData = this._buildBlockData()
    const nonce = this.proofOfWork(previousBlockHash, currentBlockData)
    const hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
    const newBlock = await this.createAndBroadcastBlock(nonce, previousBlockHash, hash)
    await this.createAndBroadcastTransaction(12.5, "00", this._nodeId)
    return newBlock
  }

  receiveBlock(newBlock) {
    if(this._validateNewBlock(newBlock)){
      this._chain.push(newBlock)
      this._pendingTransactions=[]
    } else {
      throw new Error("Invalid block")
    }
  }

  _validateNewBlock(block) {
    const l = this._getLastBlock()
    return l.hash == block.previousBlockHash && block.index == this._getCurrentIndex()
  }

  createBlock(nonce, previousBlockHash, hash) {
    const newBlock = this._buildBlock(nonce, previousBlockHash, hash)
    this._pendingTransactions=[]
    this._chain.push(newBlock)
    return newBlock
  }

  async createAndBroadcastBlock(nonce, previousBlockHash, hash) {
    const newBlock = this.createBlock(nonce, previousBlockHash, hash)
    await this._network.broadcastBlock(newBlock)
    return newBlock
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

  async createAndBroadcastTransaction(amount, sender, recipient) {
    const [blockIndex, newTransaction] = this.createTransaction(amount, sender, recipient)
    await this._network.broadcastTransaction(newTransaction)
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

  chainIsValid(chain) {
    for(let i = 1; i < chain.length; i++) {
      const curBlock = chain[i]
      const prevBlock = chain[i-1]
      const curBlockData = {index: curBlock.index, transactions: curBlock.transactions}
      const hash = this.hashBlock(prevBlock.hash, curBlockData, curBlock.nonce)
      if(hash.substring(0,4) != "0000") return false
      if(curBlock.previousBlockHash != prevBlock.hash) return false
    }
    const gb = chain[0]
    return gb.nonce == 100 && gb.previousBlockHash == "0" && gb.hash == "0" && gb.transactions.length == 0
  }

  reachConsensus() {
    const chains = this._network.getChainsFromNodes()
    return chains
  }
}