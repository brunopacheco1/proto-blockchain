import express from "express"
import bodyParser from "body-parser"
import validator from "express-validator"
import cors from "cors"
import blockchainRest from "./api/BlockchainRest"
import uuid from "uuid/v1"

const NODE_PORT = process.env.PORT || 4000

const ENV = process.env.NODE_ENV || "dev"

export default () => {
  const app = express()
  
  app.profile = {}
  app.profile.name = ENV
  app.profile.port = NODE_PORT
  app.profile.nodeAddress = uuid().split("-").join("")

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

  return app
}