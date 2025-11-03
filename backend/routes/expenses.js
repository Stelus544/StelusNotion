const express = require('express');
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id });
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    res.json({ expenses, total });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener gastos' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const expense = new Expense({ ...req.body, userId: req.user.id });
    await expense.save();
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: 'Error al agregar gasto' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    await Expense.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: 'Gasto actualizado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar gasto' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Gasto eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar gasto' });
  }
});

module.exports = router;