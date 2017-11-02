const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//   console.log(result);
// });
//
// Todo.findOneAndRemove({_id: '59fb000a48b4fc9a59fedf43'}).then((todo) =>{
//
// });

// Todo.findByIdAndRemove('59fb000a48b4fc9a59fedf43').then((todo) => {
//   console.log(todo);
// });
