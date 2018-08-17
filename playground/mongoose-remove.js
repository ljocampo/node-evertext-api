const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Note} = require('../server/models/note');
const {User} = require('../server/models/user');

// Note.remove({}).then((result) => {
//   console.log(result);
// });

// Note.findOneAndRemove({}).then((note) => {
//   console.log(note);
// });

Note.findByIdAndRemove('5b75e3aea8160110e5dff814').then((note) => {
  console.log(note);
});