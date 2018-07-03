import test from "ava"

export default (request) => {
  test("Request to /, status 200 expected.", async t => {
    const response = await request.get("/")
    t.is(response.status, 200)
  })

  test("Request to /blockchain, empty chain expected.", async t => {
    const response = await request.get("/blockchain")
    t.is(response.status, 200)
    t.is(response.body._chain.length, 1)
    t.is(response.body._chain[0].index, 1)
    t.is(response.body._chain[0].nonce, 100)
    t.is(response.body._chain[0].transactions.length, 0)
    t.is(response.body._chain[0].hash, "0")
    t.is(response.body._chain[0].previousBlockHash, "0")
    t.is(response.body._pendingTransactions.length, 0)
  })

  test("Request to /transaction, expecting 400.", async t => {
    const newTransaction = {}
    const response = await request.post("/transaction").send(newTransaction)
    t.is(response.status, 400)
    t.regex(response.text, /amount is a mandatory field/)
    t.regex(response.text, /sender is a mandatory field/)
    t.regex(response.text, /recipient is a mandatory field/)
  })

  test("Request to /transaction, succeed expected.", async t => {
    const newTransaction = {amount: 300, sender: "SENDER_1", recipient: "RECIPIENT_2"}
    const response = await request.post("/transaction").send(newTransaction)
    t.is(response.status, 200)
    t.is(response.body.blockIndex, 2)
  })

  test("Request to /mine, succeed expected.", async t => {
    const response = await request.post("/mine")
    t.is(response.status, 200)

    const block = response.body
    
    t.is(block.hash.substring(0, 4), "0000")
    t.is(block.previousBlockHash, "0")
    t.is(block.transactions.length, 2)
    t.is(block.index, 2)
    t.is(block.transactions[0].amount, 300)
    t.is(block.transactions[0].sender, "SENDER_1")
    t.is(block.transactions[0].recipient, "RECIPIENT_2")
    t.is(block.transactions[1].amount, 12.5)
    t.is(block.transactions[1].sender, "00")
  })
}