import Blockchain from "../domain/Blockchain"
import checkApi from "express-validator/check"
import transactionValidation from "../validation/transaction"
const {checkSchema} = checkApi

export default app => {
  const blockchain = new Blockchain(app.profile.nodeId)
  
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
    const blockIndex = blockchain.createTransaction(amount, sender, recipient)
    response.send({blockIndex})
  })

  app.post("/mine", (_, response) => {
    const block = blockchain.mine()
    response.send(block)
  })
}