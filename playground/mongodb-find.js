//const MongoClient = require('mongodb').MongoClient;
const { MongoClient, Object } = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    console.log('Unable to connect to MongoDB server');
  }
  console.log('Conected to MongoDB server');

  // db.collection('Todos').find({
  //   _id: new ObjectID('5a199d064c7df424f49409a3'),
  // }).toArray().then((docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Unable to fech todos', err);
  // });

  // db.collection('Todos').find({ completed: false }).count().then((count) => {
  //   console.log(`Todos count: ${count}`);
  // }, (err) => {
  //   console.log('Unable to fech todos', err);
  // });

  db.collection('Users').find({ name: 'Julian' }).count().then((count) => {
    console.log(`Users count: ${count}`);
    db.collection('Users').find({name: 'Julian'}).toArray().then((docs) => {
      console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
      console.log('Unable to fech todos', err);      
    });
  }, (err) => {
    console.log('Unable to fech todos', err);
  });
  // db.close();
});
