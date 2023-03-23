const notes = require("../data/notes-data");

function list(req, res) {
  res.json({ data: notes });
}

let lastNoteId = notes.reduce((maxId, note) => Math.max(maxId, note.id), 0)

function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({ status: 400, message: `Must include a ${propertyName}` });
  };
}

function create(req, res) {
  const { data: { text } = {} } = req.body;
  const newNote = {
    id: ++lastNoteId, // Assign the next ID
    text,
  };
  notes.push(newNote);
  res.status(201).json({ data: newNote });
}

function noteExists(req, res, next) {
  const noteId = Number(req.params.noteId);
  const foundNote = notes.find((note) => note.id === noteId);
  if (foundNote) {
    return next();
  } else {
    return next({
      status: 404,
      message: `Note id not found: ${req.params.noteId}`,
    });
  }
}

function read(req, res) {
  const { noteId } = req.params;
  const foundNote = notes.find((note) => note.id === Number(noteId));
  res.json({ data: foundNote });
  }

function update(req, res) {
  const { noteId } = req.params;
  const foundNote = notes.find((note) => note.id === Number(noteId));
  const { data: { text } = {} } = req.body;

  // Update the paste
  foundNote.text = text;

  res.json({ data: foundNote });
}

function destroy(req, res) {
  const { noteId } = req.params;
  const index = notes.findIndex((note) => note.id === Number(noteId));
  // `splice()` returns an array of the deleted elements, even if it is one element
  const deletedNotes = notes.splice(index, 1);
  res.sendStatus(204);
}

module.exports = {
  create: [
      bodyDataHas("text"),
      create
  ],
  list,
  read: [noteExists, read],
  update: [
      noteExists,
      bodyDataHas("text"),
      update
  ],
  delete: [noteExists, destroy],
};











