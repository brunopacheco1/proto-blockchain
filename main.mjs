import init from "./app/init"

const app = init()

const ENV = process.env.NODE_ENV || "dev"
const profile = app.profile

app.listen(profile.port, () => {
  console.log(`Environment: ${ENV}`)
  console.log(`Port: ${profile.port}`)
  console.log(`URL: ${profile.nodeUrl}`)
  console.log(`RabbitMQ: ${profile.rabbitmqServer}`)
})