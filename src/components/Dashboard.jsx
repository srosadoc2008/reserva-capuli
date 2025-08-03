// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

function Dashboard() {
  const [reservas, setReservas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerReservas = async () => {
      try {
        const response = await fetch('http://localhost:3001/reservas');
        const data = await response.json();
        setReservas(data);
      } catch (error) {
        console.error('Error al obtener reservas:', error);
      }
    };

    obtenerReservas();
  }, []);

  const total = reservas.length;
  const confirmadas = reservas.filter(r => r.estado === 'Confirmada').length;
  const canceladas = reservas.filter(r => r.estado === 'Cancelada').length;
  const pendientes = reservas.filter(r => r.estado === 'Pendiente').length;

  return (
    <div className="dashboard">
      <h2>Resumen General de Reservas</h2>

      <div className="tarjetas">
        <div className="tarjeta total">
          <p className="titulo">Total de Reservas</p>
          <p className="kpi">{total}</p>
        </div>
        <div className="tarjeta confirmadas">
          <p className="titulo">Reservas Confirmadas</p>
          <p className="kpi">{confirmadas}</p>
        </div>
        <div className="tarjeta pendientes">
          <p className="titulo">Reservas Pendientes</p>
          <p className="kpi">{pendientes}</p>
        </div>
        <div className="tarjeta canceladas">
          <p className="titulo">Reservas Canceladas</p>
          <p className="kpi">{canceladas}</p>
        </div>
      </div>

      <div className="botones-dashboard">
        {reservas.length > 0 ? (
          <button onClick={() => navigate('/reservas')}>Ver Lista de Reservas</button>
        ) : (
          <p className="aviso">No hay reservas para mostrar.</p>
        )}
        <button onClick={() => navigate('/')}>Volver al Inicio</button>
      </div>
    </div>
  );
}

export default Dashboard;

