import React, { useEffect, useState } from 'react';
import '../styles/dashboard.css';

// Componente que muestra un resumen general de las reservas
function Dashboard() {
  const [total, setTotal] = useState(0);
  const [confirmadas, setConfirmadas] = useState(0);
  const [canceladas, setCanceladas] = useState(0);

  // Al cargar el componente, leemos las reservas del localStorage y calculamos los totales
  useEffect(() => {
    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];

    setTotal(reservas.length);
    setConfirmadas(reservas.filter(r => r.estado === 'Confirmada').length);
    setCanceladas(reservas.filter(r => r.estado === 'Cancelada').length);
  }, []);

  return (
    <div className="dashboard">
      <h2>Resumen de Reservas</h2>

      {/* Tarjetas con los totales */}
      <div className="tarjetas">
        <div className="tarjeta total">
          <h3>Total</h3>
          <p>{total}</p>
        </div>
        <div className="tarjeta confirmadas">
          <h3>Confirmadas</h3>
          <p>{confirmadas}</p>
        </div>
        <div className="tarjeta canceladas">
          <h3>Canceladas</h3>
          <p>{canceladas}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

