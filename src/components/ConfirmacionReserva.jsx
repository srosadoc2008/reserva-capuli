import React from 'react';
import '../styles/confirmacionReserva.css';

// Componente que muestra el resumen de una reserva confirmada
function ConfirmacionReserva({ reserva, onNuevaReserva }) {
  return (
    <div className="contenedor-formulario confirmacion">
      <h2>¡Reserva Confirmada!</h2>

      {/* Mostramos todos los datos importantes de la reserva */}
      <p><strong>👤 Nombre:</strong> {reserva.nombre}</p>
      <p><strong>📞 Teléfono:</strong> {reserva.telefono}</p>
      <p><strong>📅 Fecha:</strong> {reserva.fecha}</p>
      <p><strong>⏰ Hora:</strong> {reserva.hora}</p>
      <p><strong>👥 Personas:</strong> {reserva.personas}</p>
      <p><strong>🍽️ Mesa:</strong> {reserva.mesa}</p>
      <p><strong>🔐 Código de Confirmación:</strong> {reserva.codigo}</p>

      {/* Botón para permitir al cliente hacer otra reserva */}
      <button onClick={onNuevaReserva}>Hacer otra reserva</button>

      {/* Información del restaurante al pie del resumen */}
      <div className="info-restaurante">
        <hr />
        <p><strong>Restaurante Capulí</strong></p>
        <p>Av. Los Jazmines 1746 – San Isidro – Lima – Perú</p>
        <p>📞 Teléfono: 956 763 253</p>
      </div>
    </div>
  );
}

export default ConfirmacionReserva;
