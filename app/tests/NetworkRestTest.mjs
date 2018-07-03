import test from "ava"

export default (request) => {

  test("Request to /network, single node expected.", async t => {
    let response = await request.get("/network")
    t.is(response.status, 200)
    t.is(response.body._nodeUrl, "http://localhost:4000")
    t.is(response.body._networkNodes.length, 0)
  })

  test("Request to /broadcast, expecting 400.", async t => {
    const body = {}
    let response = await request.post("/broadcast").send(body)
    t.is(response.status, 400)
    t.regex(response.text, /newNode is a mandatory field and it should be an URL/)

    body.newNode = "asdasdasdas"
    response = await request.post("/broadcast").send(body)
    t.is(response.status, 400)
    t.regex(response.text, /newNode is a mandatory field and it should be an URL/)
  })

  test("Request to /broadcast, succeed expected.", async t => {
    const body = {newNode: "http://localhost:4000"}
    let response = await request.post("/broadcast").send(body)
    t.is(response.status, 200)
  })

  test("Request to /register, expecting 400.", async t => {
    const body = {}
    let response = await request.post("/register").send(body)
    t.is(response.status, 400)
    t.regex(response.text, /newNodes is a mandatory field and it should be an array of URL/)

    body.newNodes = ["asdasdasdas"]
    response = await request.post("/register").send(body)
    t.is(response.status, 400)
    t.regex(response.text, /newNodes is a mandatory field and it should be an array of URL/)
  })

  test("Request to /register, succeed expected.", async t => {
    const body = {newNodes: ["http://localhost:4000"]}
    let response = await request.post("/register").send(body)
    t.is(response.status, 200)
  })
}