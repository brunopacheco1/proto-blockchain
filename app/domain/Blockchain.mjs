export default class Blochain {
  
  constructor() {
    this._chain=[]
    this._pendingTransactions=[]
  }

  createBlock(nonce, previousBlockHash, hash) {
    const newBlock = this._buildBlock(nonce, previousBlockHash, hash)
    this._pendingTransactions=[]
    this._chain.push(newBlock)
  }

  _buildBlock(nonce, previousBlockHash, hash) {
    return {
      index: this._getLastIndex(), timestamp: Date.now(), 
      transactions: this._pendingTransactions, nonce: nonce,
      hash, previousBlockHash
    }
  }

  getChain() {
    return this._chain
  }

  createTransaction(amount, sender, recipient) {
    const newTransaction = {amount, sender, recipient}
    this._pendingTransactions.push(newTransaction)
    return this._getLastIndex()
  }

  getPendingTransactions() {
    return this._pendingTransactions
  }

  _getLastIndex() {
    return this._chain.length + 1
  }
}