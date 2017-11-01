const expect = require('expect');
const request = require('supertest');

const {
  app
} = require('./../server');
const {
  Todo
} = require('./../models/todo');

const todos = [{
  text: 'First test todo'
},
{
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
