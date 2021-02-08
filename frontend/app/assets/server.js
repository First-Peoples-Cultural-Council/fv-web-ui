const express = require('express')
const proxy = require('express-http-proxy')
const path = require('path')

const app = express()

app.use('/nuxeo', proxy('127.0.0.1:8080'))
app.use('/assets', express.static(path.resolve(__dirname, 'assets')))
// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'))
})

const port = process.env.PORT || 5000
app.listen(port)

// eslint-disable-next-line
console.log(`App is listening on port http://0.0.0.0:${port}`)
