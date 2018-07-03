export default class Network {
  
  constructor(nodeUrl, requestService) {
    this._nodeUrl=nodeUrl
    this._networkNodes=[]
    this._requestService=requestService
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
        this._networkNodes.push(newNode)
      } catch(e) {
        console.log(`Node ${newNode} out of order.`)
        console.log(e)
      }
    }
  }

  async registerAndBroadcastNode(newNode) {
    if(this._nodeUrl != newNode) {
      await this.registerNodes([newNode])
      await Promise.all(this._networkNodes.map(node => this._broadcastNodes(node)))
    }
  }

  async _broadcastNodes(node) {
    try {
      const newNodes=[...this._networkNodes, this._nodeUrl]
      await this._requestService(`${node}/register`,{method: "POST", body:{newNodes},json: true})
    } catch(e) {
      console.log(e)
    }
  }
}