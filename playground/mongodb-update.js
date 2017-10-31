// const MongoClient = require('mongodb').MongoClient;
const {
  MongoClient,
  ObjectID
} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to the database server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('59f86107debbb4a85d3bdc12')
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result)=>{
  //   console.log(result);
  // });

  // update the name to something else
  // and increment age
  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('59f35a8b856f031ee4746012')
  }, {
    $set:{
      name: 'Wagner'
    },
    $inc: {
      age: -1
    }
  }, {
    returnOriginal: false
  }).then((result)=>{
    console.log(result);
  });

  // db.close();
});
