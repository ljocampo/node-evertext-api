const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Note} = require('../server/models/note');
const {User} = require('../server/models/user');

// var id = '5b7208f3a6aef91bb0128bf011';
//
// if (!ObjectID.isValid(id)) {
//   console.log('Id not valid');
// }

//
// Note.find({
//   _id: id
// }).then((notes) => {
//   console.log('Notes', notes);
// }, (e) => {
//   console.log(e);
// });
//
// Note.findOne({
//   _id: id
// }).then((note) => {
//   console.log('Note', note);
// }, (err) => {
//   console.log(err);
// });

// Note.findById(id).then((note) => {
//   if (!note) {
//     return console.log('Id note not found');
//   }
//   console.log('Node by Id', note);
// }).catch((err) => {console.log(err);});

var uid = '5b6cd7f142daf9213ec0ce43'

User.findById(uid).then((user) => {
  if (!user) {
    return console.log('Id user not found');
  }
  console.log('User by id', user);
}).catch((err) => {console.log(err);})