const express = require('express');
const File = require('../models/File');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se subió archivo' });
    const file = new File({ userId: req.user.id, filename: req.file.filename, path: req.file.path });
    await file.save();
    res.json(file);
  } catch (err) {
    res.status(500).json({ error: 'Error al subir archivo' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const files = await File.find({ userId: req.user.id });
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener archivos' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (file) require('fs').unlinkSync(file.path);
    await File.findByIdAndDelete(req.params.id);
    res.json({ message: 'Archivo eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar archivo' });
  }
});

module.exports = router;