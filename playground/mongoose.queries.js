const { ObjectID } = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

const id = '5a19e19949a9dcdc1ea92f86';

if (!ObjectID.isValid(id)) {
  console.log('Id not valid');
}
else {
  Todo.findById(id).then((todos) => {
    console.log('TodobyID', todos);
  }).catch((e) => console.log(e));
  
  User.findById(id).then((user) => {
    console.log('UserID', user);
  }).catch((e) => console.log(e));
}
// Todo.find({
//   _id: id,
// }).then((todos) => {
//   console.log('Todos', todos);
// });

// Todo.findOne({
//   _id: id,
// }).then((todos) => {
//   console.log('Todo', todos);
// });

