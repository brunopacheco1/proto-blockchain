import Blockchain from "../domain/Blockchain"

export default app => {
  const mycoin = new Blockchain(app.profile.nodeAddress)
  
  app.get("/", (_, response) => {
    response.sendStatus(200)
  })

  app.get("/blockchain", (request, response) => {
    response.send(mycoin)
  })

  app.post("/transaction", (request, response) => {
    const amount = request.body.amount
    const sender = request.body.sender
    const recipient = request.body.recipient
    const blockIndex = mycoin.createTransaction(amount, sender, recipient)
    response.send({blockIndex})
  })

  app.post("/mine", (request, response) => {
    const block = mycoin.mine()
    response.send(block)
  })
}