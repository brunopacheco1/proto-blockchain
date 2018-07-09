import crypto from "crypto"
import uuid from "uuid/v1"

export default class Blochain {
  
  constructor(nodeId, network) {
    this._nodeId=nodeId
    this._chain=[]
    this._pendingTransactions=[]
    this._network=network
    this._createGenesisBlock()
  }

  _createGenesisBlock() {
    const genesisBlock = {
      index: this._getCurrentIndex(), transactions: [],
      timestamp: Date.now(), previousBlockHash: "0", hash: "0", nonce: 100
    }
    this._chain.push(genesisBlock)
  }

  async mine() {
    const newBlock = await this.createAndBroadcastBlock()
    await this.createAndBroadcastTransaction(12.5, "00", this._nodeId)
    return newBlock
  }

  async createAndBroadcastBlock() {
    const newBlock = this.createBlock()
    await this._network.broadcastBlock(newBlock)
    return newBlock
  }

  createBlock() {
    const newBlock = this._buildBlock()
    newBlock.nonce = this.proofOfWork(newBlock)
    newBlock.hash = this.hashBlock(newBlock)
    this._pendingTransactions=[]
    this._chain.push(newBlock)
    return newBlock
  }

  proofOfWork(block) {
    block.nonce = 0
    while(!this.hashBlock(block).startsWith("0000")) block.nonce++
    return block.nonce
  }

  hashBlock(block) {
    return this._hash(JSON.stringify(block))
  }

  _hash(message) {
    const secret = "MY_SECRET"
    return crypto.createHmac("sha256", secret).update(message).digest("hex")
  }

  _buildBlock() {
    return {
      index: this._getCurrentIndex(), transactions: this._pendingTransactions,
      timestamp: Date.now(), previousBlockHash: this.getLastBlock().hash
    }
  }

  async createAndBroadcastTransaction(amount, sender, recipient) {
    const [blockIndex, newTransaction] = this.createTransaction(amount, sender, recipient)
    await this._network.broadcastTransaction(newTransaction)
    return [blockIndex, newTransaction]
  }

  createTransaction(amount, sender, recipient, transactionId) {
    const newTransactionId = transactionId || uuid().split("-").join("")
    const newTransaction = {amount, sender, recipient, transactionId: newTransactionId}
    this._pendingTransactions.push(newTransaction)
    return [this._getCurrentIndex(), newTransaction]
  }

  getPendingTransactions() {
    return this._pendingTransactions
  }

  getChain() {
    return this._chain
  }
  
  getLastBlock() {
    return this._chain[this._chain.length - 1]
  }

  _getCurrentIndex() {
    return this._chain.length + 1
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
    const l = this.getLastBlock()
    const oldHash = block.hash
    delete block.hash
    block.hash = this.hashBlock(block)
    if(block.hash.substring(0,4) != "0000" || oldHash != block.hash) return false
    return l.hash == block.previousBlockHash && block.index == this._getCurrentIndex()
  }

  chainIsValid(chain) {
    for(let i = 1; i < chain.length; i++) {
      const curBlock = chain[i]
      const prevBlock = chain[i-1]
      const oldHash = curBlock.hash
      delete curBlock.hash
      curBlock.hash = this.hashBlock(curBlock)
      if(curBlock.hash.substring(0,4) != "0000" || oldHash != curBlock.hash) return false
      if(curBlock.previousBlockHash != prevBlock.hash) return false
    }
    const gb = chain[0] //genesis block
    return gb.nonce == 100 && gb.previousBlockHash == "0" && gb.hash == "0" && gb.transactions.length == 0
  }

  async connectToNetwork() {
    const connected = await this._network.connectToNetwork()
    if(connected) setTimeout(async () => await this.consensus(), 5000)
  }

  async consensus() {
    const blockchains = await this._network.getChainsFromNodes()
    let longestBlockchain = null
    let longestLength = this._chain.length
    blockchains.forEach(blockchain => {
      if(blockchain._chain.length > longestLength) longestBlockchain = blockchain
    })
    if(longestBlockchain && this.chainIsValid(longestBlockchain._chain)) {
      this._chain = longestBlockchain._chain
      this._pendingTransactions = longestBlockchain._pendingTransactions
    }
  }

  getBlock(hash) {
    let blockFound = null
    this._chain.forEach(block => {
      if(block.hash == hash) blockFound = block
    })
    return blockFound
  }

  getTransaction(transactionId) {
    let transactionFound = null
    this._chain.forEach(block => {
      block.transactions.forEach(transaction => {
        if(transaction.transactionId == transactionId) transactionFound = {transaction, block}
      })
    })
    return transactionFound
  }

  getBalanceByAddress(address) {
    const balance = {transactions:[], income: 0, outcome:0, total:0}
    this._chain.forEach(block => {
      block.transactions.forEach(transaction => {
        if(transaction.recipient == address || transaction.sender == address) balance.transactions.push(transaction)
        if(transaction.recipient == address) balance.income += transaction.amount
        if(transaction.sender == address) balance.outcome += transaction.amount
      })
    })
    balance.total = balance.income - balance.outcome
    return balance.transactions.length == 0 ? null : balance
  }
}