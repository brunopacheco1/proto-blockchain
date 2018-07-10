import amqp from "amqplib/callback_api"

export default class QueueManager {

  constructor(blockchain){
    this._blockchain = blockchain
    this._NEW_NODE_QUEUE = "proto-blockchain.new-node"
    this._CONSENSUS_QUEUE = "proto-blockchain.consensus"
  }

  _createChannel(rabbitmqServer) {
    return new Promise(done => {
      amqp.connect(rabbitmqServer, (err, conn) => {
        conn.createChannel((err, ch) => {
          ch.prefetch(1)
          done(ch)
        })
      })
    })
  }

  _consume(channel, exchange, consumer) {
    channel.assertQueue("", {exclusive: true}, (err, q) => {
      channel.bindQueue(q.queue, exchange, "")
      channel.consume(q.queue, consumer, {noAck: false})
    })
  }

  _publish(channel, exchange, message) {
    channel.publish(exchange, "", Buffer.from(JSON.stringify(message)))
  }

  async initialize(rabbitmqServer) {
    if(rabbitmqServer) {
      const channel = await this._createChannel(rabbitmqServer)
      this._startNewNodeConsumer(channel)
      this._startConsensusConsumer(channel)
      this._publishCurrentNodeToTheNetwork(channel)
    }
  }

  _startNewNodeConsumer(channel) {
    this._consume(channel, this._NEW_NODE_QUEUE, async (msg) => {
      const event = JSON.parse(msg.content.toString())
      await this._blockchain.getNetwork().registerNodes(event.newNodes)
      channel.ack(msg)
      this._publish(channel, this._CONSENSUS_QUEUE, this._blockchain)
    })
  }

  _startConsensusConsumer(channel) {
    this._consume(channel, this._CONSENSUS_QUEUE, async (msg) => {
      const blockchain = JSON.parse(msg.content.toString())
      await this._blockchain.consensusByNode(blockchain)
      channel.ack(msg)
    })    
  }

  _publishCurrentNodeToTheNetwork(channel) {
    setTimeout(() => {
      const newNodes = {newNodes:[this._blockchain.getNetwork().getNodeUrl()]}
      this._publish(channel, this._NEW_NODE_QUEUE, newNodes)
    }, 3000)
  }
}