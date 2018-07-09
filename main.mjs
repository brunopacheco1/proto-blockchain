import init from "./app/init"

const app = init()

const profile = app.profile

app.listen(profile.port, () => {
  console.log(`Environment: ${profile.name}`)
  console.log(`Port: ${profile.port}`)
  console.log(`URL: ${profile.nodeUrl}`)
  console.log(`RabbitMQ: ${profile.rabbitmqServer}`)
})