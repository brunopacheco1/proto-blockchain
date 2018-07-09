import amqp from "amqplib/callback_api"

export default class QueueManager {

  constructor(blockchain){
    this._blockchain = blockchain
  }

  _initialize(rabbitmqServer) {
    return new Promise(done => {
      amqp.connect(rabbitmqServer, (err, conn) => {
        conn.createChannel((err, ch) => {
          done(ch)
        })
      })
    })
  }

  _consume(channel, exchange, consumer) {
    channel.assertQueue("", {exclusive: true}, (err, q) => {
      channel.bindQueue(q.queue, exchange, "")
      channel.consume(q.queue, consumer, {noAck: true})
    })
  }

  _publish(channel, exchange, message) {
    channel.publish(exchange, "", Buffer.from(JSON.stringify(message)))
  }

  async initializeQueues(rabbitmqServer) {
    if(rabbitmqServer) {
      const channel = await this._initialize(rabbitmqServer)

      this._consume(channel, "proto-blockchain.new-node", async (msg) => {
        const event = JSON.parse(msg.content.toString())
        await this._blockchain._network.registerNodes(event.newNodes)
        this._publish(channel, "proto-blockchain.consensus", this._blockchain)
      })

      this._consume(channel, "proto-blockchain.consensus", async (msg) => {
        const blockchain = JSON.parse(msg.content.toString())
        await this._blockchain.consensusByNode(blockchain)
      })

      setTimeout(() => {
        const newNodes = {newNodes:[this._blockchain._network._nodeUrl]}
        this._publish(channel, "proto-blockchain.new-node", newNodes)
      }, 3000)
    }
  }
}