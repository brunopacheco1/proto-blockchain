import Blockchain from "../domain/Blockchain"
import Network from "../domain/Network"
import request from "request-promise-native"
import checkApi from "express-validator/check"
const {checkSchema} = checkApi
import transactionValidation from "../validation/transaction"
import nodesValidation from "../validation/nodes"
import blockValidation from "../validation/block"
import endpoints from "./endpoints"

export default app => {
  const network = new Network(app.profile.nodeUrl, request)
  const blockchain = new Blockchain(app.profile.nodeId, network)
  
  app.get(endpoints.GET_INDEX, (_, response) => {
    response.sendStatus(200)
  })

  app.get(endpoints.GET_BLOCKCHAIN, (_, response) => {
    response.send(blockchain)
  })

  app.post(endpoints.POST_TRANSACTION, checkSchema(transactionValidation), (request, response) => {
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

  app.post(endpoints.POST_TRANSACTION_BROADCAST, checkSchema(transactionValidation), async (request, response) => {
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

  app.get(endpoints.GET_TRANSACTION, (request, response) => {
    const id = request.params.id
    const transaction = blockchain.getTransaction(id)
    if(transaction) response.send(transaction);
    else response.sendStatus(404)
  })

  app.post(endpoints.POST_BLOCK, checkSchema(blockValidation), (request, response) => {
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

  app.get(endpoints.GET_BLOCK, (request, response) => {
    const hash = request.params.hash
    const block = blockchain.getBlock(hash)
    
    if(block) response.send(block);
    else response.sendStatus(404)
  })

  app.post(endpoints.POST_MINE, async (_, response) => {
    const block = await blockchain.mine()
    response.send(block)
  })

  app.post(endpoints.POST_CONSENSUS, async (_, response) => {
    await blockchain.consensus()
    response.sendStatus(200)
  })

  app.get(endpoints.GET_NETWORK, (_, response) => {
    response.send(network)
  })

  app.post(endpoints.POST_NETWORK_BROADCAST, checkSchema(nodesValidation), async (request, response) => {
    const errors = request.validationErrors()
    if(errors) {
      response.status(400).send({errors})
      return
    }
    await network.registerAndBroadcastNodes(request.body.newNodes)
    response.sendStatus(200)
  })

  app.post(endpoints.POST_NETWORK_REGISTER, checkSchema(nodesValidation), (request, response) => {
    const errors = request.validationErrors()
    if(errors) {
      response.status(400).send({errors})
      return
    }
    network.registerNodes(request.body.newNodes)
    response.sendStatus(200)
  })

  app.get(endpoints.GET_BALANCE, (request, response) => {
    const address = request.params.address
    const balance = blockchain.getBalanceByAddress(address)

    if(balance) response.send(balance);
    else response.sendStatus(404)
  })
}