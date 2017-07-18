const express = require('express');
var app = express();

app.get('/', (req, res)=>{
  res.send('Hello home page');
});
app.get('/login', (req, res)=>{
  res.send('<h1>Login please<h1>');
});
app.listen(3000, ()=>{
  console.log('Connected 3000 port!');
});
