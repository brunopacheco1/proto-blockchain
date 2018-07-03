import blockchainTest from "./app/tests/BlockchainTest.mjs"
import networkTest from "./app/tests/NetworkTest.mjs"
import blockchainRestTest from "./app/tests/BlockchainRestTest.mjs"
import networkRestTest from "./app/tests/NetworkRestTest.mjs"
import supertest from "supertest"
import init from "./app/init"

const request = supertest(init())

blockchainTest()
networkTest()
blockchainRestTest(request)
networkRestTest(request)