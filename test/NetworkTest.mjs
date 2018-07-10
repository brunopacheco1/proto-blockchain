import Network from "../app/domain/Network"
import test from "ava"

const network = new Network("NODE_URL", () => new Promise(done => done("OK")))

test("Check node url, succeed expected.", async t => {
  t.is(network.getNodeUrl(), "NODE_URL")
})

test("Registering new node, expecting no changes.", async t => {
  await network.registerNodes(["NODE_URL"])
  t.is(network.getNetworkNodes().length, 0)
})

test("Registering new node, expecting succeed.", async t => {
  await network.registerNodes(["NODE_URL_1"])
  t.is(network.getNetworkNodes().length, 1)
})

test("Registering and broadcasting new node, expecting no changes.", async t => {
  await network.registerAndBroadcastNodes(["NODE_URL_1"])
  t.is(network.getNetworkNodes().length, 1)
})

test("Registering and broadcasting new node, expecting succeed.", async t => {
  await network.registerAndBroadcastNodes(["NODE_URL_2"])
  t.is(network.getNetworkNodes().length, 2)
})

test("Check if node is up and running, expecting fail on request and no changes in the network.", async t => {
  network._requestService = () => new Promise((done, reject) => reject("Fail to request"))
  await network._checkIfUpAndAdd(["NODE_URL_2"])
  t.is(network.getNetworkNodes().length, 2)
})

test("Broadcast node, expecting fail on request and no changes in the network.", async t => {
  network._requestService = () => new Promise((done, reject) => reject("Fail to request"))
  await network._broadcastNodes(["http://localhost:5000"])
  t.pass()
})

test("Broadcast transaction, expecting fail on request and no changes in the network.", async t => {
  network._requestService = () => new Promise((done, reject) => reject("Fail to request"))
  await network.broadcastTransaction({amount: 12.5, sender: "00",recipient: "9ab18a507f8311e8a22173c03004a307",transactionId: "63db0ce07f8811e8a22173c03004a307"})
  t.pass()
})

test("Broadcast block, expecting fail on request and no changes in the network.", async t => {
  network._requestService = () => new Promise((done, reject) => reject("Fail to request"))
  await network.broadcastBlock({
    index: 2,
    transactions: [],
    timestamp: 1530794627195,
    previousBlockHash: "0",
    nonce: 19481,
    hash: "00003858510f18b2c099bc084fd42a8b5c234f1b0c05ff91cb41179c2f7c90c7"
  })
  t.pass()
})

test("Request chains from the network, expecting fail on request and no changes in the network.", async t => {
  network._requestService = () => new Promise((done, reject) => reject("Fail to request"))
  
  const chains = await network.getChainsFromNodes()
  t.pass()
})