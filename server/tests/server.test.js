const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');


const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const {
  todos,
  populateTodos,
  users,
  populateUsers,
} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    const text = 'Test todo text';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find({ text }).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
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

describe('GET /todos', () => {
  it('should get all todo', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});
describe('GET /todos/:id', () => {
  it('should return the id of todo', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });
  it('should return the 404 for not existing id', (done) => {
    const fakeId = new ObjectID();
    request(app)
      .get(`/todos/${fakeId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
  it('should return the 404 for worng id', (done) => {
    const fakeId = 'dasd';
    request(app)
      .get(`/todos/${fakeId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should return the id of todo', (done) => {
    request(app)
      .delete(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.findById(todos[0]._id.toHexString()).then((todo) => {
          console.log(todo);
          expect(todo).toNotExist();
          done();
        }).catch((e) => done(e));
        request(app)
          .get(`/todos/${todos[0]._id.toHexString()}`)
          .expect(404);
      });
  });
  it('should return the 404 for not existing id', (done) => {
    const fakeId = new ObjectID();
    request(app)
      .get(`/todos/${fakeId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
  it('should return the 404 for worng id', (done) => {
    const fakeId = 'd$d';
    request(app)
      .get(`/todos/${fakeId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});
describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    const id = todos[0]._id.toHexString();
    const textUpdate = 'Update';
    request(app)
      .patch(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token)      
      .send({
        completed:true,
        text: textUpdate,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(textUpdate);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if a', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });
  it('should return 401 if not autenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', 'Fake')
      .expect(401)
      .end(done);
  });
});
describe('POST /users', () => {
  it('should create a user', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'test@mail.de',
        password: '123abc',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toBe('test@mail.de');
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        User.findOne({ email: 'test@mail.de' }).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe('123abc');
          done();
        });
      });
  });
  it('should return validation erros it request invalid', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'testmail.de',
        password: '123abc',
      })
      .expect(400)
      .end(done);
  });
  it('should not create a user if email in use', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: '123abc',
      })
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {

  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password,
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[1]).toInclude({
            access: 'auth',
            token: res.headers['x-auth'],
          });
          done();
        }).catch((e) => done(e));
      });
  });
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: 'wrong',
      })
      .expect(400)
      .end(done);
  });
});

describe('DELETE /users/login', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(users[0]._id).then((user) => {
          expect(user.tokens[0]).toNotExist();
          done();
        }).catch((e) => done(e));
      });
  });
});

