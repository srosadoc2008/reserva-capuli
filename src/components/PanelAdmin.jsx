import React, { useState } from 'react';
import Dashboard from './Dashboard';
import ListaReservas from './ListaReservas';
import '../styles/panelAdmin.css';

// Componente que representa el panel del administrador
function PanelAdmin({ onCerrarSesion }) {
  // Estado para controlar qué vista mostrar: "dashboard" o "reservas"
  const [vista, setVista] = useState('dashboard');

  return (
    <div className="panel-admin">
      {/* Encabezado del panel con botones para navegar entre vistas */}
      <header className="panel-header">
        <h2>Panel de Administración</h2>
        <div className="botones-panel">
          <button onClick={() => setVista('dashboard')}>Dashboard</button>
          <button onClick={() => setVista('reservas')}>Reservas</button>
          <button className="cerrar-sesion-btn" onClick={onCerrarSesion}>Cerrar sesión</button>
        </div>
      </header>

      {/* Mostrar el componente correspondiente según la vista seleccionada */}
      <div className="contenido-panel">
        {vista === 'dashboard' ? <Dashboard /> : <ListaReservas />}
      </div>
    </div>
  );
}

export default PanelAdmin;

