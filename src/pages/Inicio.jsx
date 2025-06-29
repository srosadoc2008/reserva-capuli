import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/inicio.css';

function Inicio() {
  const navegar = useNavigate();

  return (
    <div className="inicio">
      <div className="contenedor-inicio">
        <h2>Bienvenido al</h2>
        <h2>Restaurante Capulí</h2>
        <p>Seleccione una opción para continuar:</p>

        <div className="botones-inicio">
          <button onClick={() => navegar('/cliente')}>Reserva de Cliente</button>
          <button onClick={() => navegar('/admin')}>Administrador</button>
        </div>
      </div>
    </div>
  );
}

export default Inicio;


