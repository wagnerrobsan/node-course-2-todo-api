const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {
  app
} = require('./../server');
const {
  Todo
} = require('./../models/todo');

const todos = [{
  _id: new ObjectId(),
  text: 'First test todo'
},
{
  _id: new ObjectId(),
  text: 'Second test todo'
}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({
        text: text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', ()=>{
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res)=>{
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', ()=>{
  it('should return todo doc', (done) =>{
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) =>{
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', (done)=>{
    var invalidId = new ObjectId().toHexString();
    request(app)
      .get(`/todos/${invalidId}`)
      .expect(404)
      .end(done);
  });

  it('should return 400 for non object ids', (done) =>{
    request(app)
      .get('/todos/123')
      .expect(400)
      .end(done);
  });
});

describe('DELETE /todos', ()=>{
  it('should remove a todo', (done)=>{
    var hexId = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) =>{
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res)=>{
        if (err){
          return done(err);
        }
        // query db using the findById
        Todo.findById(hexId).then((todo)=>{
          expect(todo).toBeNull();
          done();
        }).catch((e) => done(e));
        // use toNotExist  expect(res).toNotExist
        // and then catch
      });
  });

  it('should return 404 if todo not found', (done)=>{
    var invalidId = new ObjectId().toHexString();
    request(app)
      .delete(`/todos/${invalidId}`)
      .expect(404)
      .end(done);
  });

  it('should return 400 if object id is invalid', (done)=>{
    request(app)
      .delete('/todos/123')
      .expect(400)
      .end(done);
  });
});

describe('POST /users', () => {
  it('should not create user with invalid body data', (done) =>{
    var wagner = {
      name: 'Wagner Roberto',
      email: 'wagner@cobham.com',
      age: 37
    };

    request(app)
      .post('/users')
      .send({
        name: 'Wagner Roberto',
        age: 37
      })
      .expect(400)
      .expect((res)=>{
        expect(res.body.message).toBe("User validation failed: email: Path `email` is required.");
      })
      .end((err, res)=>{
        if (err){
          return done(err);
        }
        done();
      });
  });
});
