const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const {Note} = require('./models/note');
const {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/notes', (req, res) => {
  var note = new Note({
    text: req.body.text
  });

  note.save().then((doc) => {
    res.send(doc);
  },(e) => {
    res.status(400).send(e);
  })
});



app.listen(3000, () => {
  console.log('Started on port 3000');
})

module.exports = {app};