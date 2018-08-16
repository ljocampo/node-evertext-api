const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/NotesApp', {
  useNewUrlParser: true
});

module.exports = {
  mongoose
};