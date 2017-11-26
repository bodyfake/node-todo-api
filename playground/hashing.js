
const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let password = '123abc';
// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   });
// });

const hashedPassword = '$2a$10$lbPMeSs4IR0CWf7LOlWRguL/nZsKipv01omyZ6JIeGilH7SwInTGe';

bcrypt.compare('!23', hashedPassword, (err, result) => {
  console.log(result);
});
const data = {
  id: 10
};

// const token = jwt.sign(data, '123abc');
// console.log(token);

// const decoded = jwt.verify(token, '123abcc');

// console.log(decoded);

// jwt.verify

// const message = 'I am user number 3';

// const hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);


// const data = {
//   id: 4,
// };

// const token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString(),
// };

// token.data.id = 5;

// const resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if (resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed. DO not trust');
// }
