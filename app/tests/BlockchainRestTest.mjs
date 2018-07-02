import test from "ava"

export default (request) => {
  test("Request to index, status 200 expected.", async t => {
    const response = await request.get("/")
    t.is(response.status, 200)
  })
}