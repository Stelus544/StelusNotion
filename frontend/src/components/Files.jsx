import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Files.css';

function Files() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/files`, { headers: { Authorization: `Bearer ${token}` } });
      setFiles(res.data);
    } catch (err) {
      alert('Error al cargar archivos');
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return alert('Selecciona un archivo');
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/files`, formData, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
      setSelectedFile(null);
      fetchFiles();
    } catch (err) {
      alert('Error al subir archivo');
    }
  };

  const deleteFile = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/files/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchFiles();
    } catch (err) {
      alert('Error al eliminar archivo');
    }
  };

  return (
    <div className="files">
      <div className="card">
        <h2>Archivos</h2>
        <div className="form-group">
          <input type="file" onChange={e => setSelectedFile(e.target.files[0])} />
        </div>
        <button className="btn btn-success" onClick={uploadFile}>Subir</button>
        <ul className="list">
          {files.map(file => (
            <li key={file._id} className="list-item">
              <a href={`${import.meta.env.VITE_API_URL}/${file.path}`} target="_blank" rel="noopener noreferrer">{file.filename}</a>
              <button className="btn btn-danger" onClick={() => deleteFile(file._id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Files;