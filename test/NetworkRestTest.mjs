import test from "ava"
import endpoints from "../app/api/endpoints"
import supertest from "supertest"
import init from "../app/init"

const request = supertest(init())

test("Request the network, single node expected.", async t => {
  const response = await request.get(endpoints.GET_NETWORK)
  t.is(response.status, 200)
  t.is(response.body._nodeUrl, "http://localhost:4000")
  t.is(response.body._networkNodes.length, 0)
})

test("Post new nodes, expecting 400 as body is empty.", async t => {
  const body = {}
  const response = await request.post(endpoints.POST_NODES).send(body)
  t.is(response.status, 400)
  t.regex(response.text, /newNodes is a mandatory field and it should be an array of URL/)
})

test("Post new nodes, expecting 400 as at least one of the new nodes is invalid.", async t => {
  const body = {newNodes: ["asdasdasdas", "http://localhost:3002"]}
  const response = await request.post(endpoints.POST_NODES).send(body)
  t.is(response.status, 400)
  t.regex(response.text, /newNodes is a mandatory field and it should be an array of URL/)
})

test("Post new nodes, succeed expected.", async t => {
  const body = {newNodes: ["http://localhost:4000"]}
  const response = await request.post(endpoints.POST_NODES).send(body)
  t.is(response.status, 200)
})

const putNodes = endpoints.PUT_NODES

test("Put the new nodes in the network, expecting 400 as body is empty.", async t => {
  const body = {}
  const response = await request.put(endpoints.PUT_NODES).send(body)
  t.is(response.status, 400)
  t.regex(response.text, /newNodes is a mandatory field and it should be an array of URL/)
})

test("Put the new nodes in the network, expecting 400 as at least one of the new nodes is invalid.", async t => {
  const body = {newNodes: ["asdasdasdas", "http://localhost:3002"]}
  const response = await request.put(endpoints.PUT_NODES).send(body)
  t.is(response.status, 400)
  t.regex(response.text, /newNodes is a mandatory field and it should be an array of URL/)
})

test("Put the new nodes in the network, succeed expected.", async t => {
  const body = {newNodes: ["http://localhost:4000"]}
  const response = await request.put(endpoints.PUT_NODES).send(body)
  t.is(response.status, 200)
})