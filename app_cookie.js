const express = require('express');
var cookieParser = require('cookie-parser');
var app = express();
app.use(cookieParser('2D3Z%dfasZ!q123#'));

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
/*
cart = {
  id : 수량
  1:count
  2:count
}

*/
app.get('/cart/:id', (req, res)=>{
  var id = req.params.id;
  var cart = {};
  if (req.signedCookies.cart) {
    cart = req.signedCookies.cart;
  }else {
      cart = {};
  }
  if (!cart[id]) {
    cart[id] = 0;
  }
  cart[id] = parseInt(cart[id])+1;
  res.cookie('cart', cart, {signed:true});
  res.redirect('/cart');

});

app.get('/cart', (req, res)=>{
  var cart = req.signedCookies.cart;
  if (!cart) {
    res.send('Empty!');
  } else {
    var output = '';
    for(var id in cart){
      output += `
      <li>
        ${products[id].title} (${cart[id]})
      </li>`;
    }
    res.send(`
      <h1>Cart</h1>
      <ul>${output}</ul>
      <a href="/products">Products List</a>
      `);
  }
});



app.get('/count', (req, res)=>{
   var count;
  if (req.signedCookies.count) {
    count = parseInt(req.signedCookies.count);
  }else {
    count = 0;
  }
  res.cookie('count', count+1, {signed:true});
  res.send('count : '+ count);

});





app.listen(3000, ()=>{
  console.log('Connected 3000 port');
});
