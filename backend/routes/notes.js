const express = require('express');
const Note = require('../models/Note');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener notas' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const note = new Note({ ...req.body, userId: req.user.id });
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar nota' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    await Note.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: 'Nota actualizada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar nota' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Nota eliminada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar nota' });
  }
});

module.exports = router;