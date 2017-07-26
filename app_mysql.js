const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
var _storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({ storage:_storage });
var fs = require('fs');
var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : '',
  user     : '',
  password : '',
  database : ''
});

var app = express();

app.locals.pretty = true;

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/user', express.static('uploads'));

app.set('views', './views_mysql');
app.set('view engine', 'pug');

app.get('/upload', (req, res)=>{
  res.render('upload');
});

app.post('/upload', upload.single('userfile'), (req, res)=>{
  console.log(req.file);
  res.send('Uploaded : '+ req.file.filename);
});

app.get('/topic/add', (req, res)=>{
  var sql = 'SELECT id,title FROM topic';
  conn.query(sql, (err, topics, fileds)=>{
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else {
      res.render('add', {topics:topics});
    }

  });

});

app.post('/topic/add', (req, res)=>{
  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;
  var sql = 'INSERT INTO topic (title, description, author) VALUES(?,?,?)';
  conn.query(sql, [title, description, author], (err, result, fileds)=>{
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else {
      res.redirect('/topic/'+result.insertId);
    }
  });
});

app.get(['/topic/:id/edit'], (req, res)=>{
  var sql = 'SELECT id,title FROM topic';
  conn.query(sql, (err, topics, fileds)=>{
    var id = req.params.id;
    if (id) {
      var sql = 'SELECT * FROM topic WHERE id=?';
      conn.query(sql, [id], (err, topic, fileds)=>{
        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
        }else {
          res.render('edit', {topics:topics, topic:topic[0]});
        }
      });
    }else {
      console.log('There is no id.');
      res.status(500).send('Internal Server Error');
    }

  });
});

app.post(['/topic/:id/edit'], (req, res)=>{
  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;
  var id = req.params.id;
  var sql = 'UPDATE topic SET title=?, description=?, author=? WHERE id=?';

  conn.query(sql, [title, description, author, id], (err, result, fileds)=>{
    if (err) {
      console.log(err);
      res.status(500).send('Internal Sever Error');
    }else {
      res.redirect('/topic/'+id);
    }
  });

});

app.get('/topic/:id/delete', (req, res)=>{
  var sql = 'SELECT id,title FROM topic';
  var id = req.params.id;
  conn.query(sql, (err, topics, fileds)=>{
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else {
      var sql = 'SELECT * FROM topic WHERE id=?';
      conn.query(sql, [id], (err, topic, fileds)=>{
        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
        }else {
          if (topic.length === 0) {
            console.log('There is no record');
            res.status(500).send('Internal Server Error');
          }else {
            res.render('delete', {topics:topics, topic:topic[0]});
          }

        }
      });
    }
  });

});

app.post('/topic/:id/delete', (req, res)=>{
  var id = req.params.id;
  var sql = 'DELETE FROM topic WHERE id=?';
  conn.query(sql, [id], (err, result)=>{
    if (err) {
      console.log(err);
    }else {
      res.redirect('/topic');
    }

  });


});

app.get(['/topic', '/topic/:id'], (req, res)=>{
  var sql = 'SELECT id,title FROM topic';
  conn.query(sql, (err, topics, fileds)=>{
    var id = req.params.id;
    if (id) {
      var sql = 'SELECT * FROM topic WHERE id=?';
      conn.query(sql, [id], (err, topic, fileds)=>{
        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
        }else {
          res.render('view', {topics:topics, topic:topic[0]});
        }
      });
    }else {
      res.render('view', {topics:topics});
    }

  });
});

app.post('/topic', (req, res)=>{
  var title = req.body.title;
  var description = req.body.description;
  fs.writeFile('data/'+title, description, (err)=>{
    if (err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.send('Success!');
  });
});

app.listen(3000, ()=>{
  console.log('Connected, 3000 port!');
});
