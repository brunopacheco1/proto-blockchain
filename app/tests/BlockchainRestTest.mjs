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

  test("Request to /block, expecting 400.", async t => {
    const block = {}
    const response = await request.post("/block").send(block)
    t.is(response.status, 400)
    t.regex(response.text, /index is a mandatory field/)
    t.regex(response.text, /transactions is a mandatory field/)
    t.regex(response.text, /timestamp is a mandatory field/)
    t.regex(response.text, /nonce is a mandatory field/)
    t.regex(response.text, /hash is a mandatory field/)
    t.regex(response.text, /previousBlockHash is a mandatory field/)
  })

  test("Request to /block, expecting invalid block response.", async t => {
    const block = {
      index: 49,
        transactions: [],
        timestamp: 1530702661337,
        nonce: 153012,
        hash: "TESTES",
        previousBlockHash: "0asdasd"
    }
    const response = await request.post("/block").send(block)
    t.is(response.status, 400)
    t.regex(response.text, /Invalid block/)
  })

  test("Request to /block, succeed expected.", async t => {
    const block = {
      index: 2,
      transactions: [],
      timestamp: 1530702661337,
      nonce: 153012,
      hash: "TESTES",
      previousBlockHash: "0"
    }
    const response = await request.post("/block").send(block)
    t.is(response.status, 200)
  })

  test("Request to /transaction, expecting 400.", async t => {
    const newTransaction = {transactionId: ""}
    const response = await request.post("/transaction").send(newTransaction)
    t.is(response.status, 400)
    t.regex(response.text, /amount is a mandatory field/)
    t.regex(response.text, /sender is a mandatory field/)
    t.regex(response.text, /recipient is a mandatory field/)
    t.regex(response.text, /transactionId is a mandatory field/)
  })

  test("Request to /transaction, succeed expected.", async t => {
    const newTransaction = {transactionId: "NEW_TRANSACTION", amount: 300, sender: "SENDER_1", recipient: "RECIPIENT_2"}
    const response = await request.post("/transaction").send(newTransaction)
    t.is(response.status, 200)
    t.is(response.body.blockIndex, 3)
  })

  test("Request to /transaction/broadcast, expecting 400.", async t => {
    const newTransaction = {transactionId: ""}
    const response = await request.post("/transaction/broadcast").send(newTransaction)
    t.is(response.status, 400)
    t.regex(response.text, /amount is a mandatory field/)
    t.regex(response.text, /sender is a mandatory field/)
    t.regex(response.text, /recipient is a mandatory field/)
    t.regex(response.text, /transactionId is a mandatory field/)
  })

  test("Request to /transaction/broadcast, succeed expected.", async t => {
    const newTransaction = {amount: 300, sender: "SENDER_1", recipient: "RECIPIENT_2"}
    const response = await request.post("/transaction/broadcast").send(newTransaction)
    t.is(response.status, 200)
    t.is(response.body.blockIndex, 3)
  })

  test("Request to /mine, succeed expected.", async t => {
    const response = await request.post("/mine")
    t.is(response.status, 200)

    const block = response.body
    
    t.is(block.hash.substring(0, 4), "0000")
    t.is(block.previousBlockHash, "TESTES")
    t.is(block.transactions.length, 2)
    t.is(block.index, 3)
    t.is(block.transactions[0].amount, 300)
    t.is(block.transactions[0].sender, "SENDER_1")
    t.is(block.transactions[0].recipient, "RECIPIENT_2")
    t.is(block.transactions[1].amount, 300)
    t.is(block.transactions[1].sender, "SENDER_1")
    t.is(block.transactions[1].recipient, "RECIPIENT_2")
  })

  test("Request to /consensus, succeed expected.", async t => {
    const response = await request.post("/consensus")
    t.is(response.status, 200)
  })

  test("Request to /block/:id, succeed expected.", async t => {
    const response = await request.get("/block/TESTES")
    const block = response.body
    t.is(block.index, 2)
    t.is(block.transactions.length, 0)
    t.is(block.timestamp, 1530702661337)
    t.is(block.hash, "TESTES")
    t.is(block.previousBlockHash, "0")
  })

  test("Request to /transaction/:id, succeed expected.", async t => {
    const response = await request.get("/transaction/NEW_TRANSACTION")
    const res = response.body
    t.is(response.status, 200)
    t.is(res.transaction.transactionId, "NEW_TRANSACTION")
    t.is(res.transaction.amount, 300)
    t.is(res.transaction.sender, "SENDER_1")
    t.is(res.transaction.recipient, "RECIPIENT_2")
  })

  test("Request to /balance/:address, succeed expected.", async t => {
    const response = await request.get("/balance/RECIPIENT_2")
    const balance = response.body
    t.is(response.status, 200)
    t.is(balance.transactions.length, 2)
    t.is(balance.outcome, 0)
    t.is(balance.income, 600)
    t.is(balance.total, 600)
  })

  test("Request to /block/:id, null expected.", async t => {
    const response = await request.get("/block/blablabla")
    t.is(response.status, 200)
    t.is(response.text.length, 0)
  })

  test("Request to /transaction/:id, null expected.", async t => {
    const response = await request.get("/transaction/blablabla")
    t.is(response.status, 200)
    t.is(response.text.length, 0)
  })

  test("Request to /balance/:address, empty expected.", async t => {
    const response = await request.get("/balance/blablabla")
    t.is(response.status, 200)
    t.is(response.text.length, 0)
  })
}