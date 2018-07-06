import test from "ava"
import endpoints from "../api/endpoints"

export default (request) => {
  test(`Request to ${endpoints.GET_INDEX}, status 200 expected.`, async t => {
    const response = await request.get(endpoints.GET_INDEX)
    t.is(response.status, 200)
  })

  test(`Request to ${endpoints.GET_BLOCKCHAIN}, empty chain expected.`, async t => {
    const response = await request.get(endpoints.GET_BLOCKCHAIN)
    t.is(response.status, 200)
    t.is(response.body._chain.length, 1)
    t.is(response.body._chain[0].index, 1)
    t.is(response.body._chain[0].nonce, 100)
    t.is(response.body._chain[0].transactions.length, 0)
    t.is(response.body._chain[0].hash, "0")
    t.is(response.body._chain[0].previousBlockHash, "0")
    t.is(response.body._pendingTransactions.length, 0)
  })

  test(`Request to ${endpoints.POST_BLOCK}, expecting 400.`, async t => {
    const block = {}
    const response = await request.post(endpoints.POST_BLOCK).send(block)
    t.is(response.status, 400)
    t.regex(response.text, /index is a mandatory field/)
    t.regex(response.text, /transactions is a mandatory field/)
    t.regex(response.text, /timestamp is a mandatory field/)
    t.regex(response.text, /nonce is a mandatory field/)
    t.regex(response.text, /hash is a mandatory field/)
    t.regex(response.text, /previousBlockHash is a mandatory field/)
  })

  test(`Request to ${endpoints.POST_BLOCK}, expecting invalid block response as previousBlockHash and the index are invalid.`, async t => {
    const block = {
      index: 49,
      transactions: [],
      timestamp: 1530702661337,
      nonce: 153012,
      hash: "TESTES",
      previousBlockHash: "0asdasd"
    }
    const response = await request.post(endpoints.POST_BLOCK).send(block)
    t.is(response.status, 409)
    t.regex(response.text, /Invalid block/)
  })

  test(`Request to ${endpoints.POST_BLOCK}, expecting invalid block response as the hash is invalid.`, async t => {
    const block = {
      index: 2,
      transactions: [],
      timestamp: 1530702661337,
      nonce: 153012,
      hash: "TESTES",
      previousBlockHash: "0"
    }
    const response = await request.post(endpoints.POST_BLOCK).send(block)
    t.is(response.status, 409)
    t.regex(response.text, /Invalid block/)
  })

  test(`Request to ${endpoints.POST_BLOCK}, succeed expected.`, async t => {
    const block = {
      index: 2,
      transactions: [],
      timestamp: 1530794627195,
      previousBlockHash: "0",
      nonce: 19481,
      hash: "00003858510f18b2c099bc084fd42a8b5c234f1b0c05ff91cb41179c2f7c90c7"
    }
    const response = await request.post(endpoints.POST_BLOCK).send(block)
    t.is(response.status, 200)
  })

  test(`Request to ${endpoints.POST_TRANSACTION}, expecting 400.`, async t => {
    const newTransaction = {transactionId: ""}
    const response = await request.post(endpoints.POST_TRANSACTION).send(newTransaction)
    t.is(response.status, 400)
    t.regex(response.text, /amount is a mandatory field/)
    t.regex(response.text, /sender is a mandatory field/)
    t.regex(response.text, /recipient is a mandatory field/)
    t.regex(response.text, /transactionId is a mandatory field/)
  })

  test(`Request to ${endpoints.POST_TRANSACTION}, succeed expected.`, async t => {
    const newTransaction = {transactionId: "NEW_TRANSACTION", amount: 300, sender: "SENDER_1", recipient: "RECIPIENT_2"}
    const response = await request.post(endpoints.POST_TRANSACTION).send(newTransaction)
    t.is(response.status, 200)
    t.is(response.body.blockIndex, 3)
  })

  test(`Request to ${endpoints.POST_TRANSACTION_BROADCAST}, expecting 400.`, async t => {
    const newTransaction = {transactionId: ""}
    const response = await request.post(endpoints.POST_TRANSACTION_BROADCAST).send(newTransaction)
    t.is(response.status, 400)
    t.regex(response.text, /amount is a mandatory field/)
    t.regex(response.text, /sender is a mandatory field/)
    t.regex(response.text, /recipient is a mandatory field/)
    t.regex(response.text, /transactionId is a mandatory field/)
  })

  test(`Request to ${endpoints.POST_TRANSACTION_BROADCAST}, succeed expected.`, async t => {
    const newTransaction = {amount: 300, sender: "SENDER_1", recipient: "RECIPIENT_2"}
    const response = await request.post(endpoints.POST_TRANSACTION_BROADCAST).send(newTransaction)
    t.is(response.status, 200)
    t.is(response.body.blockIndex, 3)
  })

  test(`Request to ${endpoints.POST_MINE}, succeed expected.`, async t => {
    const response = await request.post(endpoints.POST_MINE)
    t.is(response.status, 200)

    const block = response.body
    
    t.is(block.hash.substring(0, 4), "0000")
    t.is(block.previousBlockHash, "00003858510f18b2c099bc084fd42a8b5c234f1b0c05ff91cb41179c2f7c90c7")
    t.is(block.transactions.length, 2)
    t.is(block.index, 3)
    t.is(block.transactions[0].amount, 300)
    t.is(block.transactions[0].sender, "SENDER_1")
    t.is(block.transactions[0].recipient, "RECIPIENT_2")
    t.is(block.transactions[1].amount, 300)
    t.is(block.transactions[1].sender, "SENDER_1")
    t.is(block.transactions[1].recipient, "RECIPIENT_2")
  })

  test(`Request to ${endpoints.POST_CONSENSUS}, succeed expected.`, async t => {
    const response = await request.post(endpoints.POST_CONSENSUS)
    t.is(response.status, 200)
  })

  test(`Request to ${endpoints.GET_BLOCK}, succeed expected.`, async t => {
    const url = endpoints.GET_BLOCK.substring(0, endpoints.GET_BLOCK.indexOf(":")) + "00003858510f18b2c099bc084fd42a8b5c234f1b0c05ff91cb41179c2f7c90c7"
    const response = await request.get(url)
    const block = response.body
    t.is(block.index, 2)
    t.is(block.transactions.length, 0)
    t.is(block.timestamp, 1530794627195)
    t.is(block.hash, "00003858510f18b2c099bc084fd42a8b5c234f1b0c05ff91cb41179c2f7c90c7")
    t.is(block.previousBlockHash, "0")
  })

  test(`Request to ${endpoints.GET_TRANSACTION}, succeed expected.`, async t => {
    const url = endpoints.GET_TRANSACTION.substring(0, endpoints.GET_TRANSACTION.indexOf(":")) + "NEW_TRANSACTION"
    const response = await request.get(url)
    const res = response.body
    t.is(response.status, 200)
    t.is(res.transaction.transactionId, "NEW_TRANSACTION")
    t.is(res.transaction.amount, 300)
    t.is(res.transaction.sender, "SENDER_1")
    t.is(res.transaction.recipient, "RECIPIENT_2")
  })

  test(`Request to ${endpoints.GET_BALANCE}, succeed expected.`, async t => {
    const url = endpoints.GET_BALANCE.substring(0, endpoints.GET_BALANCE.indexOf(":")) + "RECIPIENT_2"
    const response = await request.get(url)
    const balance = response.body
    t.is(response.status, 200)
    t.is(balance.transactions.length, 2)
    t.is(balance.outcome, 0)
    t.is(balance.income, 600)
    t.is(balance.total, 600)
  })

  test(`Request to ${endpoints.GET_BLOCK}, 404 expected.`, async t => {
    const url = endpoints.GET_BLOCK.substring(0, endpoints.GET_BLOCK.indexOf(":")) + "blablabla"
    const response = await request.get(url)
    t.is(response.status, 404)
  })

  test(`Request to ${endpoints.GET_TRANSACTION}, 404 expected.`, async t => {
    const url = endpoints.GET_TRANSACTION.substring(0, endpoints.GET_TRANSACTION.indexOf(":")) + "blablabla"
    const response = await request.get(url)
    t.is(response.status, 404)
  })

  test(`Request to ${endpoints.GET_BALANCE}, 404 expected.`, async t => {
    const url = endpoints.GET_BALANCE.substring(0, endpoints.GET_BALANCE.indexOf(":")) + "blablabla"
    const response = await request.get(url)
    t.is(response.status, 404)
  })
}