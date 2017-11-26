const { ObjectID } = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//   console.log(result);
// });

//Todo.findOneAndRemove()


Todo.findByIdAndRemove('5a1a0a1938fe0733b0e00084').then((todo) => {
  console.log(todo);
});