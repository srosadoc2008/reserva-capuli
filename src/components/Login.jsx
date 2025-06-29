import React, { useState } from 'react';
import '../styles/login.css';

// Componente que gestiona el ingreso del administrador
function Login({ onLoginExitoso }) {
  // Estados locales para el usuario, contraseña y posibles errores
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  // Función que se ejecuta al enviar el formulario
  const manejarEnvio = (e) => {
    e.preventDefault(); // Prevenimos recarga de la página

    // Validamos credenciales simples
    if (usuario === 'admin' && contrasena === '1234') {
      onLoginExitoso(); // Permitimos acceso al panel
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <form className="formulario-login" onSubmit={manejarEnvio}>
      <h2>Ingreso del Administrador</h2>

      <label>Usuario:</label>
      <input
        type="text"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        required
      />

      <label>Contraseña:</label>
      <input
        type="password"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
        required
      />

      <button type="submit">Ingresar</button>

      {/* Mensaje de error si las credenciales son incorrectas */}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </form>
  );
}

export default Login;
