'use strict'
const dotenv = require('dotenv')
dotenv.config()
const fs = require('fs')
if (process.env.NODE_ENV) {
  try {
    const envConfig = dotenv.parse(fs.readFileSync('.env.' + process.env.NODE_ENV))
    for (var k in envConfig) process.env[k] = envConfig[k]  
  } catch (e) {
    console.log('missing configuration file, using defaults')
  }
}
console.log('Environment: ', process.env.NODE_ENV)

const API_PORT = process.env.API_PORT || 3000

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const http = require('http')
const https = require('https')

const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./docs/openapi.yaml')

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public')) // for html content
app.use('/api-docs', express.static('docs'), swaggerUi.serve, swaggerUi.setup(swaggerDocument, { // for OpenAPI
  swaggerOptions: {
    docExpansion: 'none'
  },  
  explorer: true 
}))

const authRoutes = require('./routes/auth')
const apiRoutes = require('./routes/api')
app.use('/api/auth', authRoutes)
app.use('/api', apiRoutes)

app.get("*", async (req, res) => {
  return res.status(404).json({ data: 'Not Found...' })
})

const server = http.createServer(app)
server.listen(API_PORT, () => console.log('REST API listening on port ' + API_PORT))

module.exports = app
