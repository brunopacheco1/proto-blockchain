import blockchainTest from "./app/tests/BlockchainTest.mjs"
import networkTest from "./app/tests/NetworkTest.mjs"
import restBlockchainTest from "./app/tests/BlockchainRestTest.mjs"

import supertest from "supertest"
import init from "./app/init"

const request = supertest(init())

blockchainTest()
networkTest()
restBlockchainTest(request)