const expect = require('expect');
const request = require('supertest');
const {
  ObjectID
} = require('mongodb');

const {
  app
} = require('../server');
const {
  Note
} = require('../models/note');

const notes = [{
  _id: new ObjectID(),
  text: 'first test note'
}, {
  _id: new ObjectID(),
  text: 'second test note',
  completed: true,
  completedAt: 333
}]

beforeEach((done) => {
  Note.remove({}).then(() => {
    return Note.insertMany(notes);
  }).then(() => done());
});

describe('POST /notes', () => {
  it('should create a new note', (done) => {
    var text = 'Test note text';
    request(app)
      .post('/notes')
      .send({
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text)
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Note.find({
          text
        }).then((notes) => {
          expect(notes.length).toBe(1);
          expect(notes[0].text).toBe(text);
          done();
        }).catch((err) => done(err));
      });
  });

  it('should not create note with invalid data', (done) => {
    request(app)
      .post('/notes')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Note.find().then((notes) => {
          expect(notes.length).toBe(2);
          done();
        }).catch((err) => done(err));
      });
  });
});

describe('GET /notes', () => {
  it('should get all notes', (done) => {
    request(app)
      .get('/notes')
      .expect(200)
      .expect((res) => {
        expect(res.body.notes.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /notes/:id', () => {
  it('should get a note', (done) => {
    request(app)
      .get(`/notes/${notes[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.note.text).toBe(notes[0].text)
      })
      .end(done);
  });

  it('should return 404 if note not found', (done) => {
    request(app)
      .get(`/notes/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 on invalid id', (done) => {
    request(app)
      .get(`/notes/123abc`)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /notes/:id', () => {
  it('should remove a note', (done) => {
    var hexId = notes[1]._id.toHexString()
    request(app)
      .delete(`/notes/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.note._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Note.findById(hexId).then((note) => {
          expect(note).toNotExist();
          done();
        }).catch((err) => done(err));
      });
  });

  it('should return 404 if note not found', (done) => {
    request(app)
      .delete(`/notes/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 on invalid id', (done) => {
    request(app)
      .delete(`/notes/123abc`)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /notes/:id', () => {
  it('should update a note', (done) => {
    var hexId = notes[1]._id.toHexString()
    request(app)
      .patch(`/notes/${hexId}`)
      .send({text: 'update text', completed: true})
      .expect(200)
      .expect((res) => {
        expect(res.body.note.text).toBe('update text');
        expect(res.body.note.completed).toBe(true);
        expect(res.body.note.completedAt).toBeA('number');
      })
      .end(done);
  });

  it('should clear completedAt when todo is not completed', (done) => {
    var hexId = notes[1]._id.toHexString()
    request(app)
      .patch(`/notes/${hexId}`)
      .send({text: 'update text', completed: false})
      .expect(200)
      .expect((res) => {
        expect(res.body.note.text).toBe('update text');
        expect(res.body.note.completed).toBe(false);
        expect(res.body.note.completedAt).toNotExist();
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a new user', (done) => {
    var email = 'luis@luis.com';
    var password = 'p45w0rd';
    var tokens = [
      {
        access: 'auth'
      },
      {
        token: 'at0k3n'
      }
    ]
    request(app)
      .post('/users')
      .send({
        email,
        password,
        tokens
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toBe(email)
        expect(res.body.password).toBe(password)
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Note.find({
          email
        }).then((users) => {
          expect(users.length).toBe(1);
          expect(users[0].email).toBe(email);
          done();
        }).catch((err) => done(err));
      });
  });
});