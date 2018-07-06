import endpoints from "./endpoints"
import fs from "fs"
import swaggerUi from "swagger-ui-express"
import YAML from "yamljs"

export default app => {
  const swaggerDocument = YAML.parse(fs.readFileSync("./app/api/api-docs.yml", "utf8"))
  app.use(endpoints.GET_SWAGGER, swaggerUi.serve, swaggerUi.setup(swaggerDocument))
}