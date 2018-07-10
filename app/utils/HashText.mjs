import crypto from "crypto"

export default class HashText {

  static hash(message) {
    const secret = "MY_SECRET"
    return crypto.createHmac("sha256", secret).update(message).digest("hex")
  }
}