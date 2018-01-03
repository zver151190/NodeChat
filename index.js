const express = require('express')
const mongodb = require('mongodb').MongoClient
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .get('/', (req, res) => res.sendFile(__dirname + '/views/pages/index.html'))
  .get('/dashboard', (req, res) => res.sendFile(__dirname + '/views/pages/dashboard.html'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
