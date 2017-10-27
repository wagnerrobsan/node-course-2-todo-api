// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) =>{
  if (err){
    return console.log('Unable to connect to the database server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) =>{
  //   if (err){
  //     return console.log('Unable to insert todo', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  // insert new into Users (name, age, location)
  //
  db.collection('Users').insertOne({
    name: 'Wagner',
    age: 37,
    location: 'Ireland'
  }, (err, result)=>{
    if (err){
      return console.log('Unable to insert User');
    }
    console.log(result.ops[0]._id.getTimestamp());
  })

  db.close();
});
