import Network from "../domain/Network"
import request from "request-promise-native"

export default app => {
  const network = new Network(app.profile.nodeUrl, request)

  app.get("/network", (request, response) => {
    response.send(network)
  })

  app.post("/broadcast", (request, response) => {
    const newNode = request.body.newNode
    network.registerAndBroadcastNode(newNode)
    response.sendStatus(200)
  })

  app.post("/register", (request, response) => {
    const newNodes = request.body.newNodes
    network.registerNodes(newNodes)
    response.sendStatus(200)
  })
}