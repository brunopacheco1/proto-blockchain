import Blockchain from "../domain/Blockchain"

export default app => {
  const blockchain = new Blockchain(app.profile.nodeId)
  
  app.get("/", (_, response) => {
    response.sendStatus(200)
  })

  app.get("/blockchain", (request, response) => {
    response.send(blockchain)
  })

  app.post("/transaction", (request, response) => {
    const amount = request.body.amount
    const sender = request.body.sender
    const recipient = request.body.recipient
    const blockIndex = blockchain.createTransaction(amount, sender, recipient)
    response.send({blockIndex})
  })

  app.post("/mine", (request, response) => {
    const block = blockchain.mine()
    response.send(block)
  })
}