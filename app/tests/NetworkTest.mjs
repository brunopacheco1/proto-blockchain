import Network from "../domain/Network"
import test from "ava"

export default () => {
  const network = new Network("NODE_URL", "NODE_MASTER", () => new Promise(done => done("OK")))

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

  test("Connecting the node to the network, expecting no changes.", async t => {
    await network.connectToNetwork()
    t.is(network.getNetworkNodes().length, 2)
  })
}