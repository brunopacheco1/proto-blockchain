import blockchainTest from "./testcases/BlockchainTest.mjs"
import networkTest from "./testcases/NetworkTest.mjs"
import isValidChainTest from "./testcases/IsValidChainTest.mjs"
import consensusTest from "./testcases/ConsensusTest.mjs"
import blockchainRestTest from "./testcases/BlockchainRestTest.mjs"
import networkRestTest from "./testcases/NetworkRestTest.mjs"
import supertest from "supertest"
import init from "./app/init"

const request = supertest(init())

blockchainTest()
networkTest()
isValidChainTest()
consensusTest()
blockchainRestTest(request)
networkRestTest(request)