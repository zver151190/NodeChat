const express = require('express')
const mongodb = require('mongodb').MongoClient
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .get('/', (req, res) => res.render('pages/index.html'))
  .get('/dashboard', (req, res) => res.render('pages/dashboard.html'))
  .get('/chat', (req, res) => res.render('pages/chat.html'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
