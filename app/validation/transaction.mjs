export default {
  amount: {
    errorMessage: "amount is a mandatory field and it should be a number value",
    isNumeric: true,
    optional: false,
    toFloat: true
  },
  sender: {
    errorMessage: "sender is a mandatory field",
    isLength: {
      errorMessage: "sender is a mandatory field",
      options: { min: 3 }
    },
    optional: false
  },
  recipient: {
    errorMessage: "recipient is a mandatory field",
    isLength: {
      errorMessage: "recipient is a mandatory field",
      options: { min: 3 }
    },
    optional: false
  },
  transactionId: {
    errorMessage: "transactionId is a mandatory field",
    isLength: {
      errorMessage: "transactionId is a mandatory field",
      options: { min: 3 }
    },
    optional: true
  }
}