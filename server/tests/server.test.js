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
  text: 'second test note'
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
  xit('should update a note', (done) => {

  });

  xit('should return 404 if note not found', (done) => {

  });

  xit('should return 404 on invalid id', (done) => {

  });
});