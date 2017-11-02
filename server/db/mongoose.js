var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/TodoApp', { useMongoClient: true });
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp', { useMongoClient: true });
//mongodb://root:admin@ds245805.mlab.com:45805/nodejs-todo-api
module.exports ={mongoose: mongoose};
