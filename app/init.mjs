import express from "express"
import bodyParser from "body-parser"
import validator from "express-validator"
import cors from "cors"
import uuid from "uuid/v1"
import blockchainRest from "./api/BlockchainRest"
import swagger from "./api/swagger"

const NODE_PORT = process.env.PORT || 4000
const NODE_URL = process.env.NODE_URL || "http://localhost:4000"
const NODE_MASTER = process.env.NODE_MASTER
const RABBITMQ = process.env.NODE_RABBITMQ
const ENV = process.env.NODE_ENV || "dev"

export default () => {
  const app = express()
  
  app.profile = {}
  app.profile.name = ENV
  app.profile.port = NODE_PORT
  app.profile.nodeId = uuid().split("-").join("")
  app.profile.nodeUrl = NODE_URL
  app.profile.nodeMaster = NODE_MASTER
  app.profile.rabbitmqServer = RABBITMQ
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(bodyParser.json())
  app.use(validator())

  var corsOption = {
    origin: true,
    methods: "GET,PUT,POST,DELETE",
    credentials: true,
    exposedHeaders: ["x-auth-token"]
  }
  app.use(cors(corsOption))

  blockchainRest(app)
  swagger(app)
  
  return app
}