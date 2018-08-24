const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = 'password';

bcrypt.genSalt(66, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  })
});

// var hashedPassword = '$2a$10$2pN8NYgIsJct4t6McooO4ePj0ZLJW306EPRQw0uhqmGpODq6a8diK'
//
// bcrypt.compare(password, hashedPassword, (err, res) => {
//   console.log(res);
// });