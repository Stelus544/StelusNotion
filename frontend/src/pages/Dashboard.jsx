import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import Notes from '../components/Notes';
import Tasks from '../components/Tasks';
import Expenses from '../components/Expenses';
import Files from '../components/Files';


function Dashboard() {
  const [section, setSection] = useState('notes');
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/login');
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <header>
        <h1>Notion Clone</h1>
        <div>
          <button className="btn btn-secondary" onClick={toggleTheme}>Modo {isDark ? 'Claro' : 'Oscuro'}</button>
          <button className="btn btn-danger" onClick={logout}>Cerrar Sesión</button>
        </div>
      </header>
      <nav>
        <button className={`btn ${section === 'notes' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSection('notes')}>Apuntes</button>
        <button className={`btn ${section === 'tasks' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSection('tasks')}>Tareas</button>
        <button className={`btn ${section === 'expenses' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSection('expenses')}>Gastos</button>
        <button className={`btn ${section === 'files' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSection('files')}>Archivos</button>
      </nav>
      <main>
        {section === 'notes' && <Notes />}
        {section === 'tasks' && <Tasks />}
        {section === 'expenses' && <Expenses />}
        {section === 'files' && <Files />}
      </main>
    </div>
  );
}

export default Dashboard;