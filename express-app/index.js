const express = require('express')
var app = express()

app.get('/', (req, res) => {
  res.send('welcome to yn-nishi express')
})

app.listen(3000, () => {
  console.log('start server port 3000')
})