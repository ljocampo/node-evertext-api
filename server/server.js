const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

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

app.get('/notes', (req, res) => {
  Note.find().then((notes) => {
    res.send({notes});
  },(err) => {
    res.status(400).send(err);
  });
});

app.get('/notes/:id',(req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Note.findById(id).then((note) => {
    if (!note) {
      return res.status(404).send();
    }
    res.send({note});
  }).catch((err) => {
    res.status(400).send(err);
  });
})

app.listen(3000, () => {
  console.log('Started on port 3000');
})

module.exports = {app};