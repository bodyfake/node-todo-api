//const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

const obj = new ObjectID();
console.log(obj);

const user = { name: 'julian', age: 25 };
const {name} = user;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  db.collection('Todos').insertOne({
    text: 'Something to do',
    completed: false,
  }, (err2, result) => {
    if (err2) {
      return console.log('Unable to insert todo', err2);
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
  });

  db.collection('Users').insertOne({
    name: 'Julian',
    age: 25,
    location: 'Trier',
  }, (err2, result) => {
    if (err2) {
      return console.log('Unable to insert todo', err2);
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
    console.log(result.ops[0]._id.getTimestamp());
  });
  db.close();
});
