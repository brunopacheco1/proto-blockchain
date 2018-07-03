import crypto from "crypto"

export default class Blochain {
  
  constructor(nodeAddress, nodeUrl, request) {
    this._chain=[]
    this._pendingTransactions=[]
    this._nodeAddress=nodeAddress
    this._nodeUrl=nodeUrl
    this._networkNodes=[]
    this._requestService = request
    this.createBlock(100, "0", "0")//Genesis block
  }

  mine() {
    const lastBlock = this._getLastBlock()
    const previousBlockHash = lastBlock.hash
    const currentBlockData = this._buildBlockData()
    const nonce = this.proofOfWork(previousBlockHash, currentBlockData)
    const hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
    this.createTransaction(12.5, "00", this._nodeAddress)
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

  createTransaction(amount, sender, recipient) {
    const newTransaction = {amount, sender, recipient}
    this._pendingTransactions.push(newTransaction)
    return this._getCurrentIndex()
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

  async registerNodes(newNodes) {
    await Promise.all(newNodes.map(newNode => this._checkIfUpAndAdd(newNode)))
  }

  getNetworkNodes() {
    return this._networkNodes
  }

  async _checkIfUpAndAdd(newNode) {
    if(this._nodeUrl != newNode && !this._networkNodes.includes(newNode)) {
      try {
        await this._requestService(`${newNode}/`)
        console.log(`Node ${newNode} is up.`)
        this._networkNodes.push(newNode)
      } catch(e) {
        console.log(`Node ${newNode} out of order.`)
      }
    }
  }

  async registerAndBroadcastNode(newNode) {
    if(this._nodeUrl != newNode) {
      await this.registerNodes([newNode])
      const toSend=[this._nodeUrl]
      this._networkNodes.forEach(node => toSend.push(node))
      await Promise.all(this._networkNodes.map(node => this._broadcastNodes(node, toSend)))
    }
  }

  async _broadcastNodes(node, newNodes) {
    try {
      console.log(`Sending nodes[${newNodes}] to ${node}`)
      await this._requestService(`${node}/register`,{method: "POST", body:{newNodes},json: true})
    } catch(e) {
      console.log(e)
    }
  }
}