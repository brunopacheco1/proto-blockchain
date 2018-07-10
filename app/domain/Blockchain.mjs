import uuid from "uuid/v1"
import HashText from "../utils/HashText"

export default class Blochain {
  
  constructor(network) {
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
    await this.createAndBroadcastTransaction(12.5, "00", this._network.getNodeId())
    return newBlock
  }

  async createAndBroadcastBlock() {
    const b = this.createBlock()
    await this._network.broadcastBlock(b)
    return b
  }

  createBlock() {
    const block = this.buildBlock()
    block.nonce = this.proofOfWork(block)
    block.hash = this.hash(block)
    this.addIntoChain(block)
    return block
  }
  
  buildBlock() {
    return {
      index: this._getCurrentIndex(), transactions: this._pendingTransactions,
      timestamp: Date.now(), previousBlockHash: this.getLastBlock().hash
    }
  }

  proofOfWork(block) {
    block.nonce = 0
    while(!this.hash(block).startsWith("0000")) block.nonce++
    return block.nonce
  }

  hash(block) {
    return HashText.hash(JSON.stringify(block))
  }

  addIntoChain(block) {
    this._pendingTransactions=[]
    this._chain.push(block)
  }

  async createAndBroadcastTransaction(amount, sender, recipient) {
    const [blockIndex, newTransaction] = this.createTransaction(amount, sender, recipient)
    await this._network.broadcastTransaction(newTransaction)
    return [blockIndex, newTransaction]
  }

  createTransaction(amount, sender, recipient, transactionId = uuid().split("-").join("")) {
    const newTransaction = {amount, sender, recipient, transactionId}
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

  receiveBlock(block) {
    if(this.isValidBlock(this.getLastBlock(), block)) this.addIntoChain(block);
    else throw new Error("Invalid block")
  }

  isValidBlock(previousBlock, block) {
    const oldHash = block.hash
    delete block.hash
    block.hash = this.hash(block)
    if(block.hash.substring(0,4) != "0000" || oldHash != block.hash) return false
    return previousBlock.hash == block.previousBlockHash && (previousBlock.index + 1) == block.index
  }

  isValidChain(chain) {
    for(let i = 1; i < chain.length; i++) if(!this.isValidBlock(chain[i-1], chain[i])) return false
    const gb = chain[0] //genesis block
    return gb.nonce == 100 && gb.previousBlockHash == "0" && gb.hash == "0" && gb.transactions.length == 0
  }

  async runConsensus() {
    const blockchains = await this._network.getChainsFromNodes()
    this.consensus(blockchains)  
  }

  consensus(blockchains) {
    let longestBlockchain = null
    let longestLength = this._chain.length
    blockchains.forEach(blockchain => {
      if(blockchain._chain.length > longestLength) longestBlockchain = blockchain
    })
    if(longestBlockchain && this.isValidChain(longestBlockchain._chain)) {
      this._chain = longestBlockchain._chain
      this._pendingTransactions = longestBlockchain._pendingTransactions
    }
  }

  async registerNodeAndRunConsensus(blockchain) {
    if(blockchain._network._nodeUrl != this._network._nodeUrl) {
      await this._network.registerNodes([blockchain._network._nodeUrl])
      this.consensus([blockchain])
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

  getNetwork() {
    return this._network
  }
}