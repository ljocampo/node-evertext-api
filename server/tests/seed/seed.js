const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Note} = require('../../models/note');
const {User} = require('../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  email: 'luis@test.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'secret').toString()
  }]
},{
  _id: userTwoId,
  email: 'javier@test.com',
  password: 'userTwoPass'
}];

const notes = [{
  _id: new ObjectID(),
  text: 'first test note'
}, {
  _id: new ObjectID(),
  text: 'second test note',
  completed: true,
  completedAt: 333
}];

const populateNotes = (done) => {
  Note.remove({}).then(() => {
    return Note.insertMany(notes);
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done());
};

module.exports = {notes, populateNotes, users, populateUsers};