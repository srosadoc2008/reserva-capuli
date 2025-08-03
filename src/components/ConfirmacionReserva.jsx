// src/components/ConfirmacionReserva.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/confirmacionReserva.css';

const ConfirmacionReserva = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reserva = location.state;

  if (!reserva) {
    return (
      <div className="confirmacion-contenedor">
        <h2>Error</h2>
        <p>No se encontraron datos de reserva.</p>
        <button className="boton-nueva-reserva" onClick={() => navigate('/')}>
          Volver a inicio
        </button>
      </div>
    );
  }

  return (
    <div className="confirmacion-contenedor">
      <h2>¡Reserva Confirmada!</h2>
      <p>Tu mesa ha sido reservada exitosamente.</p>

      <div className="detalle-reserva">
        <p><strong>👤 Nombre:</strong> {reserva.nombre}</p>
        <p><strong>📞 Teléfono:</strong> {reserva.telefono}</p>
        <p><strong>📅 Fecha:</strong> {reserva.fecha}</p>
        <p><strong>⏰ Hora:</strong> {reserva.hora}</p>
        <p><strong>🍽️ Mesa:</strong> {reserva.mesa}</p>
        <p><strong>🔐 Código de Confirmación:</strong> {reserva.codigo}</p>
      </div>

      <button className="boton-nueva-reserva" onClick={() => navigate('/')}>
        Hacer otra reserva
      </button>

      <div className="info-restaurante">
        <hr />
        <p><strong>Restaurante Capulí</strong></p>
        <p>Av. Los Jazmines 1746 – San Isidro – Lima – Perú</p>
        <p>📞 Teléfono: 956 763 253</p>
      </div>
    </div>
  );
};

export default ConfirmacionReserva;
