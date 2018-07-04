export default {
  newNodes: {
    errorMessage: "newNodes is a mandatory field and it should be an array of URL",
    custom: { options: (value) => Array.isArray(value) && value.every(child => /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(child)) },
    optional: false
  }
}