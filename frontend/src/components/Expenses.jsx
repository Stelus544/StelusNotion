import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Expenses.css';

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/expenses`, { headers: { Authorization: `Bearer ${token}` } });
      setExpenses(res.data.expenses);
      setTotal(res.data.total);
    } catch (err) {
      alert('Error al cargar gastos');
    }
  };

  const saveExpense = async () => {
    try {
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/expenses/${editingId}`, { description, amount: parseFloat(amount) }, { headers: { Authorization: `Bearer ${token}` } });
        setEditingId(null);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/expenses`, { description, amount: parseFloat(amount) }, { headers: { Authorization: `Bearer ${token}` } });
      }
      setDescription('');
      setAmount('');
      fetchExpenses();
    } catch (err) {
      alert('Error al guardar gasto');
    }
  };

  const editExpense = (expense) => {
    setDescription(expense.description);
    setAmount(expense.amount);
    setEditingId(expense._id);
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/expenses/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchExpenses();
    } catch (err) {
      alert('Error al eliminar gasto');
    }
  };

  return (
    <div className="expenses">
      <div className="card">
        <h2>Gastos</h2>
        <p className="total">Total: ${total.toFixed(2)}</p>
        <div className="form-group">
          <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Descripción" />
        </div>
        <div className="form-group">
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Monto" />
        </div>
        <button className="btn btn-success" onClick={saveExpense}>{editingId ? 'Actualizar' : 'Agregar'}</button>
        <ul className="list">
          {expenses.map(expense => (
            <li key={expense._id} className="list-item">
              <span>{expense.description}: ${expense.amount}</span>
              <div>
                <button className="btn btn-secondary" onClick={() => editExpense(expense)}>Editar</button>
                <button className="btn btn-danger" onClick={() => deleteExpense(expense._id)}>Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Expenses;