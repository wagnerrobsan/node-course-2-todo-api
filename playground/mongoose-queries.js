const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '69f9af846229280ffc51f2ab1234';
//
// if (!ObjectId.isValid(id)){
//   console.log('ID not valid');
// }
//
// Todo.find({
//   _id: id
// }).then((todos) =>{
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) =>{
//   console.log('Todos', todo);
// });

// Todo.findById(id).then((todo)=>{
//   if (!todo){
//     return console.log('Id not found');
//   }
//   console.log('Todos', todo);
// }).catch((e) => console.log(e));

// query users collection
// grab the id on robomongo
// load mongoose model
// User.findById ()
// handle 3 cases
// 1- query works but there is no user (print user not found)
// 2 - user found, print user on screen
// 3 - catch print errors that might occur

User.findById('59f9a53579d7a637f49d0b01').then((user) =>{
  if (!user){
    return console.log('User not Found');
  }
  console.log(JSON.stringify(user, undefined, 2));
}, (e) => {
  console.log(e);
});
