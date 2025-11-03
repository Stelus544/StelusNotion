import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Notes.css';

function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notes`, { headers: { Authorization: `Bearer ${token}` } });
      setNotes(res.data);
    } catch (err) {
      alert('Error al cargar notas');
    }
  };

  const saveNote = async () => {
    try {
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/notes/${editingId}`, { title, content }, { headers: { Authorization: `Bearer ${token}` } });
        setEditingId(null);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/notes`, { title, content }, { headers: { Authorization: `Bearer ${token}` } });
      }
      setTitle('');
      setContent('');
      fetchNotes();
    } catch (err) {
      alert('Error al guardar nota');
    }
  };

  const editNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note._id);
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/notes/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchNotes();
    } catch (err) {
      alert('Error al eliminar nota');
    }
  };

  return (
    <div className="notes">
      <div className="card">
        <h2>Apuntes</h2>
        <div className="form-group">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título" />
        </div>
        <div className="form-group">
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Contenido" />
        </div>
        <button className="btn btn-success" onClick={saveNote}>{editingId ? 'Actualizar' : 'Guardar'}</button>
        <ul className="list">
          {notes.map(note => (
            <li key={note._id} className="list-item">
              <div>
                <h3>{note.title}</h3>
                <p>{note.content}</p>
              </div>
              <div>
                <button className="btn btn-secondary" onClick={() => editNote(note)}>Editar</button>
                <button className="btn btn-danger" onClick={() => deleteNote(note._id)}>Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Notes;