const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');


const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo',
},
{
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333,
}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    Todo.insertMany(todos);
  }).then((result) => {
    const id = Todo.findOne({
      text: 'First test todo',
    });
    done();
  });
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    const text = 'Test todo text';

    request(app)
      .post('/todos')
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
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});
describe('GET /todos/:id', () => {
  it('should return the id of todo', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
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
      .expect(404)
      .end(done);
  });
  it('should return the 404 for worng id', (done) => {
    const fakeId = 'dasd';
    request(app)
      .get(`/todos/${fakeId}`)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should return the id of todo', (done) => {
    request(app)
      .delete(`/todos/${todos[0]._id.toHexString()}`)
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
      .expect(404)
      .end(done);
  });
  it('should return the 404 for worng id', (done) => {
    const fakeId = 'd$d';
    request(app)
      .get(`/todos/${fakeId}`)
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

