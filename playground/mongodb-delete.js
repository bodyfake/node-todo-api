
//const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    console.log('Unable to connect to MongoDB server');
  }
  console.log('Conected to MongoDB server');
  // db.collection('Todos').deleteMany({ text: 'Eat Lunch' }).then((result) => {
  //   console.log(result);
  // });

  // db.collection('Todos').deleteOne({ text: 'Walk to dog' }).then((result) => {
  //   console.log(result);
  // });

  // db.collection('Todos').findOneAndDelete({ completed: false }).then((result) => {
  //   console.log(result);
  // });

  db.collection('Users').deleteMany({ name: 'Julian' }).then((result) => {
    console.log(result);
  });
  db.collection('Users').findOneAndDelete({ 
    _id: new ObjectID('5a19a8c9588a10a4b9454f7e'),
  }).then((result) => {
    console.log(result);
  });

  // db.close();
});
