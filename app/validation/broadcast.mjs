export default {
  newNode: {
    errorMessage: "newNode is a mandatory field and it should be an URL",
    custom: { options: (value) => value != null && /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(value) },
    optional: false
  }
}