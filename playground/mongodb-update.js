//const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    console.log('Unable to connect to MongoDB server');
  }
  console.log('Conected to MongoDB server');

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('5a19d9bb268abb4622fd66c4'),
  // }, {
  //   $set: {
  //     completed: false,
  //   },
  // }, {
  //   returnOriginal: false,
  // }).then((result) => {
  //   console.log(result);
  // });
  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5a19da69268abb4622fd6705'),
  }, {
    $set: {
      name: 'Julian',
    },
    $inc: {
      age: 1,
    },
  }, {
    returnOriginal: false,
  }).then((result) => {
    console.log(result);
  });
  // db.close();
});

