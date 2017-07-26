const express = require('express');
var cookieParser = require('cookie-parser');
var app = express();
app.use(cookieParser());

var products = {
  1:{title:'The history of web 1'},
  2:{title:'The next web'}
};
app.get('/products', (req, res)=>{
  var output = '';
  for(var name in products){
    output += `

    <li>
      <a href="/cart/${name}"> ${products[name].title}
    </li>`;
    }
    res.send(`<h1>products</h1><ul>${output}</ul><a href="/cart">Cart</a>`);
});




app.get('/count', (req, res)=>{
   var count;
  if (req.cookies.count) {
    count = parseInt(req.cookies.count);
  }else {
    count = 0;
  }
  res.cookie('count', count+1);
  res.send('count : '+ count);

});





app.listen(3000, ()=>{
  console.log('Connected 3000 port');
});
