export default {
  index: {
    errorMessage: "index is a mandatory field and it should be an integer value",
    isInt: true,
    optional: false,
    toInt: true
  },
  transactions: {
    errorMessage: "transactions is a mandatory field and it should be an array of transaction",
    custom: { options: (value) => {
      if(value == null || !Array.isArray(value)) return false
      return value.every(t => {
        const str = /.+/
        const hasSender = str.test(t.sender || "")
        const hasRecipient = str.test(t.recipient = t.recipient || "")
        const hasTransactionId = str.test(t.transactionId || "")
        const hasAmount = t.amount != null && typeof t.amount == "number"
        return hasSender && hasRecipient && hasTransactionId && hasAmount
      })
    }},
    optional: false
  },
  timestamp: {
    errorMessage: "timestamp is a mandatory field",
    isInt: true,
    optional: false,
    toInt: true
  },
  nonce: {
    errorMessage: "nonce is a mandatory field and it should be an integer value",
    isInt: true,
    optional: false,
    toInt: true
  },
  hash: {
    errorMessage: "hash is a mandatory field",
    isLength: {
      errorMessage: "hash is a mandatory field",
      options: { min: 1 }
    },
    optional: false
  },
  previousBlockHash: {
    errorMessage: "previousBlockHash is a mandatory field",
    isLength: {
      errorMessage: "previousBlockHash is a mandatory field",
      options: { min: 1 }
    },
    optional: false
  }
}