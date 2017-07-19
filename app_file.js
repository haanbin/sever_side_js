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
var app = express();

app.locals.pretty = true;

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/user', express.static('uploads'));

app.set('views', './views_file');
app.set('view engine', 'pug');

app.get('/upload', (req, res)=>{
  res.render('upload');
});

app.post('/upload', upload.single('userfile'), (req, res)=>{
  console.log(req.file);
  res.send('Uploaded : '+ req.file.filename);
});

app.get('/topic/new', (req, res)=>{
  res.render('new');
});

app.get('/topic', (req, res)=>{
  fs.readdir('data', (err, files)=>{
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.render('view', {topics:files});
  });
});

app.get('/topic/:id', (req, res)=>{
  var id = req.params.id;

  fs.readdir('data', (err, files)=>{
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    fs.readFile('data/'+id,'utf8', (err, data)=>{
      if (err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
      res.render('view', {topics:files, title:id, description: data});
    });

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
