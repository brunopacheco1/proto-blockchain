import blockchainTest from "./app/tests/BlockchainTest.mjs"
import restBlockchainTest from "./app/tests/BlockchainRestTest.mjs"

import supertest from "supertest"
import init from "./app/init"

const request = supertest(init())

blockchainTest()
restBlockchainTest(request)