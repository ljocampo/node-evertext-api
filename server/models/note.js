const mongoose = require('mongoose');

var Note = mongoose.model('Note', {
  title: {
    type: String,
    default: 'Untitled text'
  },
  text: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  isTodo: {
    type: Boolean,
    default: false
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

module.exports = {Note};