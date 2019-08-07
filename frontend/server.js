const path = require('path')
const compression = require('compression')
const express = require('express')
const { matchesUA } = require('browserslist-useragent')
const app = express()
const port = 3011
app.use(compression())
app.use('*/assets', express.static(path.resolve(__dirname, 'public', 'assets')))
app.use(express.static(path.resolve(__dirname, 'public')))
app.get('/*', (req, res) => {
  const useragent = req.headers['user-agent']
  const isLegacyUser = matchesUA(useragent, {
    env: 'legacy',
    allowHigherVersions: true,
  })
  const index = isLegacyUser
    ? path.resolve(__dirname, 'public', 'legacy', 'index.html')
    : path.resolve(__dirname, 'public', 'evergreen', 'index.html')
  res.sendFile(index)
})
app.listen(port, () => console.log(`Ready @ http://localhost:${port}`)) // eslint-disable-line
