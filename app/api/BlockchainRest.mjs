import Blockchain from "../domain/Blockchain"
import request from "request-promise-native"

export default app => {
  const mycoin = new Blockchain(app.profile.nodeAddress, app.profile.nodeUrl, request)
  
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

  app.post("/broadcast", (request, response) => {
    const newNode = request.body.newNode
    mycoin.registerAndBroadcastNode(newNode)
    response.sendStatus(200)
  })

  app.post("/register", (request, response) => {
    const newNodes = request.body.newNodes
    mycoin.registerNodes(newNodes)
    response.sendStatus(200)
  })
}