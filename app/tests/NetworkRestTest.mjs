import test from "ava"
import endpoints from "../api/endpoints"

export default (request) => {

  test(`Request to ${endpoints.GET_NETWORK}, single node expected.`, async t => {
    const response = await request.get(endpoints.GET_NETWORK)
    t.is(response.status, 200)
    t.is(response.body._nodeUrl, "http://localhost:4000")
    t.is(response.body._networkNodes.length, 0)
  })

  test(`Request to ${endpoints.POST_NETWORK_BROADCAST}, expecting 400 as body is empty.`, async t => {
    const body = {}
    const response = await request.post(endpoints.POST_NETWORK_BROADCAST).send(body)
    t.is(response.status, 400)
    t.regex(response.text, /newNodes is a mandatory field and it should be an array of URL/)
  })

  test(`Request to ${endpoints.POST_NETWORK_BROADCAST}, expecting 400 as at least one of the new nodes is invalid.`, async t => {
    const body = {newNodes: ["asdasdasdas", "http://localhost:3002"]}
    const response = await request.post(endpoints.POST_NETWORK_BROADCAST).send(body)
    t.is(response.status, 400)
    t.regex(response.text, /newNodes is a mandatory field and it should be an array of URL/)
  })

  test(`Request to ${endpoints.POST_NETWORK_BROADCAST}, succeed expected.`, async t => {
    const body = {newNodes: ["http://localhost:4000"]}
    const response = await request.post(endpoints.POST_NETWORK_BROADCAST).send(body)
    t.is(response.status, 200)
  })

  test(`Request to ${endpoints.POST_NETWORK_REGISTER}, expecting 400 as body is empty.`, async t => {
    const body = {}
    const response = await request.post(endpoints.POST_NETWORK_REGISTER).send(body)
    t.is(response.status, 400)
    t.regex(response.text, /newNodes is a mandatory field and it should be an array of URL/)
  })

  test(`Request to ${endpoints.POST_NETWORK_REGISTER}, expecting 400 as at least one of the new nodes is invalid.`, async t => {
    const body = {newNodes: ["asdasdasdas", "http://localhost:3002"]}
    const response = await request.post(endpoints.POST_NETWORK_REGISTER).send(body)
    t.is(response.status, 400)
    t.regex(response.text, /newNodes is a mandatory field and it should be an array of URL/)
  })

  test(`Request to ${endpoints.POST_NETWORK_REGISTER}, succeed expected.`, async t => {
    const body = {newNodes: ["http://localhost:4000"]}
    const response = await request.post(endpoints.POST_NETWORK_REGISTER).send(body)
    t.is(response.status, 200)
  })
}