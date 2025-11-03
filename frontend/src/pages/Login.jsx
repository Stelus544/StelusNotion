import { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const handleSubmit = async () => {
    try {
      const endpoint = isRegister ? '/register' : '/login';
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth${endpoint}`, { username, password });
      if (!isRegister) {
        localStorage.setItem('token', res.data.token);
        window.location.href = '/';
      } else {
        alert('Usuario registrado');
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  return (
    <div className="login">
      <div className="card">
        <h2>{isRegister ? 'Registro' : 'Iniciar Sesión'}</h2>
        <div className="form-group">
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Usuario" />
        </div>
        <div className="form-group">
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" />
        </div>
        <button className="btn btn-primary" onClick={handleSubmit}>{isRegister ? 'Registrar' : 'Iniciar Sesión'}</button>
        <button className="btn btn-outline" onClick={() => setIsRegister(!isRegister)}>Cambiar a {isRegister ? 'Iniciar Sesión' : 'Registro'}</button>
        <button className="btn btn-secondary" onClick={toggleTheme}>Modo {isDark ? 'Claro' : 'Oscuro'}</button>
      </div>
    </div>
  );
}

export default Login;