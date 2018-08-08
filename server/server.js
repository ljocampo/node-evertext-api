const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/EverPadApp');

var Pad = mongoose.model('Pad', {
  text: {
    type: String
  },
  isTodo: {
    type: Boolean
  },
  completed: {
    type: Boolean
  },
  completedAt: {
    type: Number
  }
});

var newPad = new Pad({
  text: 'Cook dinner'
  isTodo: true
});

newPad.save().then((doc) => {
  console.log('Saved pad', doc);
}, (err) => {
  console.log('Unable to save pad');
});