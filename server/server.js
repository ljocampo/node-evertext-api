require('./config/config')

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {
  ObjectID
} = require('mongodb');

const {
  mongoose
} = require('./db/mongoose');
const {
  Note
} = require('./models/note');
const {
  User
} = require('./models/user');
const {authenticate}=require('./middleware/authenticate');

var app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());

app.post('/notes', (req, res) => {
  var note = new Note({
    text: req.body.text
  });

  note.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  })
});

app.get('/notes', (req, res) => {
  Note.find().then((notes) => {
    res.send({
      notes
    });
  }, (err) => {
    res.status(400).send(err);
  });
});

app.get('/notes/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Note.findById(id).then((note) => {
    if (!note) {
      return res.status(404).send();
    }
    res.send({
      note
    });
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.delete('/notes/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Note.findByIdAndRemove(id).then((note) => {
    if (!note) {
      return res.status(404).send();
    }
    res.send({
      note
    });
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.patch('/notes/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['title', 'text', 'completed', 'isTodo']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime(); //UNIX EPOCH
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Note.findByIdAndUpdate(id, {$set: body}, {new: true}).then((note) => {
    if (!note) {
      return res.status(404).send();
    }
    res.send({note});
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then((user) => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login',(req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    })
  }).catch((err) => {
    res.status(400).send();
  });
});

app.listen(PORT, () => {
  console.log('Started on port: ' + PORT);
});

module.exports = {
  app
};