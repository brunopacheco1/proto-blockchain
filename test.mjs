import blockchainTest from "./app/tests/BlockchainTest.mjs"
import networkTest from "./app/tests/NetworkTest.mjs"
import chainIsValidTest from "./app/tests/ChainIsValidTest.mjs"
import consensusTest from "./app/tests/ConsensusTest.mjs"
import blockchainRestTest from "./app/tests/BlockchainRestTest.mjs"
import networkRestTest from "./app/tests/NetworkRestTest.mjs"
import supertest from "supertest"
import init from "./app/init"

const request = supertest(init())

blockchainTest()
networkTest()
chainIsValidTest()
consensusTest()
blockchainRestTest(request)
networkRestTest(request)