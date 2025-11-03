import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Tasks.css';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/tasks`, { headers: { Authorization: `Bearer ${token}` } });
      setTasks(res.data);
    } catch (err) {
      alert('Error al cargar tareas');
    }
  };

  const saveTask = async () => {
    try {
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/tasks/${editingId}`, { title, description }, { headers: { Authorization: `Bearer ${token}` } });
        setEditingId(null);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/tasks`, { title, description }, { headers: { Authorization: `Bearer ${token}` } });
      }
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (err) {
      alert('Error al guardar tarea');
    }
  };

  const editTask = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setEditingId(task._id);
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchTasks();
    } catch (err) {
      alert('Error al eliminar tarea');
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/tasks/${id}`, { completed: !completed }, { headers: { Authorization: `Bearer ${token}` } });
      fetchTasks();
    } catch (err) {
      alert('Error al actualizar tarea');
    }
  };

  return (
    <div className="tasks">
      <div className="card">
        <h2>Tareas</h2>
        <div className="form-group">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título" />
        </div>
        <div className="form-group">
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Descripción" />
        </div>
        <button className="btn btn-success" onClick={saveTask}>{editingId ? 'Actualizar' : 'Crear'}</button>
        <ul className="list">
          {tasks.map(task => (
            <li key={task._id} className={`list-item ${task.completed ? 'completed' : ''}`}>
              <div>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
              </div>
              <div>
                <button className="btn btn-primary" onClick={() => toggleComplete(task._id, task.completed)}>{task.completed ? 'Marcar Pendiente' : 'Marcar Completa'}</button>
                <button className="btn btn-secondary" onClick={() => editTask(task)}>Editar</button>
                <button className="btn btn-danger" onClick={() => deleteTask(task._id)}>Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Tasks;