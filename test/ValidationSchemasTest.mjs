import blockValidation from "../app/validation/block"
import nodesValidation from "../app/validation/nodes"
import test from "ava"


test("Validating array of URL, true expected.", t => {
  const validation = nodesValidation.newNodes.custom.options
  t.true(validation(["http://localhost:4000"]))
})

test("Validating array of URL, false expected.", t => {
  const validation = nodesValidation.newNodes.custom.options
  t.false(validation(["blablabla"]))
})

test("Validating array of transactions, true expected.", t => {
  const validation = blockValidation.transactions.custom.options
  t.true(validation([{amount: 12.5, sender: "00",recipient: "9ab18a507f8311e8a22173c03004a307",transactionId: "63db0ce07f8811e8a22173c03004a307"}]))
})

test("Validating array of transactions, false expected.", t => {
  const validation = blockValidation.transactions.custom.options
  t.false(validation([{}]))
})