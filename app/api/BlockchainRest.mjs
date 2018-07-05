import Blockchain from "../domain/Blockchain"
import Network from "../domain/Network"
import request from "request-promise-native"
import checkApi from "express-validator/check"
const {checkSchema} = checkApi
import transactionValidation from "../validation/transaction"
import nodesValidation from "../validation/nodes"
import blockValidation from "../validation/block"

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

  app.post("/block", checkSchema(blockValidation), (request, response) => {
    const errors = request.validationErrors()
    if(errors) {
      response.status(400).send({errors})
      return
    }
    const block = request.body
    try {
      blockchain.receiveBlock(block)
      response.sendStatus(200)
    } catch(e) {
      response.status(400).send({errors :[e.message]})
    }
  })

  app.post("/transaction/broadcast", checkSchema(transactionValidation), async (request, response) => {
    const errors = request.validationErrors()
    if(errors) {
      response.status(400).send({errors})
      return
    }
    const amount = request.body.amount
    const sender = request.body.sender
    const recipient = request.body.recipient
    const [blockIndex, _] = await blockchain.createAndBroadcastTransaction(amount, sender, recipient)
    response.send({blockIndex})
  })

  app.post("/mine", async (_, response) => {
    const block = await blockchain.mine()
    response.send(block)
  })

  app.get("/network", (_, response) => {
    response.send(network)
  })

  app.post("/broadcast", checkSchema(nodesValidation), (request, response) => {
    const errors = request.validationErrors()
    if(errors) {
      response.status(400).send({errors})
      return
    }
    network.registerAndBroadcastNodes(request.body.newNodes)
    response.sendStatus(200)
  })

  app.post("/register", checkSchema(nodesValidation), (request, response) => {
    const errors = request.validationErrors()
    if(errors) {
      response.status(400).send({errors})
      return
    }
    network.registerNodes(request.body.newNodes)
    response.sendStatus(200)
  })

  app.post("/consensus", async (_, response) => {
    await blockchain.consensus()
    response.sendStatus(200)
  })

  app.get("/block/:hash", (request, response) => {
    const hash = request.params.hash
    const block = blockchain.getBlock(hash)
    response.send(block)
  })

  app.get("/transaction/:id", (request, response) => {
    const id = request.params.id
    const transaction = blockchain.getTransaction(id)
    response.send(transaction)
  })

  app.get("/balance/:address", (request, response) => {
    const address = request.params.address
    const balance = blockchain.getBalanceByAddress(address)
    response.send(balance)
  })
}