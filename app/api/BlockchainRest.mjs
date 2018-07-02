import Blockchain from "../domain/Blockchain"

export default app => {
  const mycoin = new Blockchain()
  
  app.get("/", (request, response) => {
    response.sendStatus(200)
  })
}