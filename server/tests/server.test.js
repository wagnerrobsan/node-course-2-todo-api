const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, users, populateTodos, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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
//
// describe('POST /users', () => {
//   it('should not create user with invalid body data', (done) =>{
//     var wagner = {
//       name: 'Wagner Roberto',
//       email: 'wagner@cobham.com',
//       age: 37
//     };
//
//     request(app)
//       .post('/users')
//       .send({
//         name: 'Wagner Roberto',
//         age: 37
//       })
//       .expect(400)
//       .expect((res)=>{
//         expect(res.body.message).toBe("User validation failed: email: Path `email` is required.");
//       })
//       .end((err, res)=>{
//         if (err){
//           return done(err);
//         }
//         done();
//       });
//   });
// });

describe('PATCH /todos/:id', ()=>{
  it('should update the todo', (done)=>{
    var hexId = todos[0]._id;
    var text = 'updated first test';
    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        text,
        completed: true
      })
      .expect(200)
      .expect((res)=>{
        expect(res).toBeTruthy();
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeTruthy();
      })
      .end((err, res)=>{
        if (err){
          return done(err);
        }
        done();
      });
  });

  it('should clear completedAt when todo is not completed', (done)=>{
    var hexId = todos[1]._id;
    var text = 'new text for second todo';
    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        text,
        complete: false
      })
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeNull();
      })
      .end((err, res)=>{
        if (err){
          return done(err);
        }
        done();
      });
  });

  describe('GET /users/me', ()=>{
    it('should return user if authenticated', (done)=>{
      request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
          expect(res.body._id).toBe(users[0]._id.toHexString());
          expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    });

    it('should return 401 if not authenticated', (done) =>{
      request(app)
        .get('/users/me')
        .expect(401)
        .expect((res)=>{
          expect(res.body).toEqual({});
        })
        .end(done);
    });
  });

  describe('POST /users', ()=>{
    it('should create a user', (done)=>{
      var email = 'test@example.com';
      var password = '123mnb!';

      request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res) =>{
          expect(res.headers['x-auth']).toBeDefined();
          expect(res.body._id).toBeDefined();
          expect(res.body.email).toBe(email);
        })
        .end((err) =>{
          if (err){
            return done(err);
          }

          User.findOne({email}).then((user) =>{
            expect(user).toBeDefined();
            expect(user.password).not.toBe(password);
            done();
          });
        });
    });

    it('should return validation errors if request invalid', (done)=>{
      request(app)
        .post('/users')
        .send({
          email: 'invalid',
          password: 'cudebur'})
        .expect(400)
        .end(done);
    });

    it('should not create user if email in use',(done)=>{
      request(app)
        .post('/users')
        .send({
          email: users[0].email,
          password: 'cudebur'
        })
        .expect(400)
        .end(done);
    });
  })
});
