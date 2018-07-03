import Network from "../domain/Network"
import request from "request-promise-native"
import checkApi from "express-validator/check"
import broadcastValidation from "../validation/broadcast"
import registerValidation from "../validation/register"
const {checkSchema} = checkApi

export default app => {
  const network = new Network(app.profile.nodeUrl, request)

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