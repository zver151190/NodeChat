const express = require('express')
const mongodb = require('mongodb').MongoClient
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .get('/', (req, res) => res.render(__dirname+'public/views/pages/index.html'))
  .get('/dashboard', (req, res) => res.render(__dirname+'public/views/pages/dashboard.html))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
