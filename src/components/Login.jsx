import React, { useState } from 'react';
import '../styles/login.css';
import { FaUser, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3001/usuarios?usuario=${usuario}&password=${password}`);
      const data = await response.json();

      if (data.length > 0) {
        localStorage.setItem('adminLoggedIn', 'true');
        navigate('/panel-admin');
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (error) {
      setError('Error al conectar con el servidor');
      console.error('Error en login:', error);
    }
  };

  return (
    <div className="login-container">
      <h2>Acceso Administrador</h2>
      <form onSubmit={handleLogin} className="login-form">
        <div className="input-group">
          <FaUser className="icon" />
          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <FaLock className="icon" />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn-ingresar">Ingresar</button>
      </form>
    </div>
  );
};

export default Login;
