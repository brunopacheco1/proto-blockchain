import Blockchain from "../domain/Blockchain"
import Network from "../domain/Network"
import request from "request-promise-native"
import checkApi from "express-validator/check"
const {checkSchema} = checkApi
import transactionValidation from "../validation/transaction"
import broadcastValidation from "../validation/broadcast"
import registerValidation from "../validation/register"


export default app => {
  const network = new Network(app.profile.nodeUrl, request)
  const blockchain = new Blockchain(app.profile.nodeId, network)
  
  app.get("/", (_, response) => {
    response.sendStatus(200)
  })

  app.get("/blockchain", (_, response) => {
    response.send(blockchain)
  })

  app.post("/transaction", checkSchema(transactionValidation), (request, response) => {
    const errors = request.validationErrors()
    if(errors) {
      response.status(400).send({errors})
      return
    }
    const amount = request.body.amount
    const sender = request.body.sender
    const recipient = request.body.recipient
    const transactionId = request.body.transactionId
    const [blockIndex, _] = blockchain.createTransaction(amount, sender, recipient, transactionId)
    response.send({blockIndex})
  })

  app.post("/transaction/broadcast", checkSchema(transactionValidation), (request, response) => {
    const errors = request.validationErrors()
    if(errors) {
      response.status(400).send({errors})
      return
    }
    const amount = request.body.amount
    const sender = request.body.sender
    const recipient = request.body.recipient
    const [blockIndex, _] = blockchain.createAndBroadcastTransaction(amount, sender, recipient)
    response.send({blockIndex})
  })

  app.post("/mine", (_, response) => {
    const block = blockchain.mine()
    response.send(block)
  })

  app.get("/network", (_, response) => {
    response.send(network)
  })

  app.post("/broadcast", checkSchema(broadcastValidation), (request, response) => {
    const errors = request.validationErrors()
    if(errors) {
      response.status(400).send({errors})
      return
    }

    const newNode = request.body.newNode
    network.registerAndBroadcastNode(newNode)
    response.sendStatus(200)
  })

  app.post("/register", checkSchema(registerValidation), (request, response) => {
    const errors = request.validationErrors()
    if(errors) {
      response.status(400).send({errors})
      return
    }
    
    const newNodes = request.body.newNodes
    network.registerNodes(newNodes)
    response.sendStatus(200)
  })
}