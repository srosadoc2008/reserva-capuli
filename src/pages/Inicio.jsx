// Inicio.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/inicio.css';

function Inicio() {
  const navegar = useNavigate();
  const [hoveredOption, setHoveredOption] = useState(null);
  
  const opciones = [
    { 
      id: 'cliente', 
      titulo: 'Reservar Mesa', 
      icono: 'ti ti-user', 
      descripcion: 'Disfruta de una experiencia gastronómica única',
      color: '#22c55e'
    },
    { 
      id: 'admin', 
      titulo: 'Administrar', 
      icono: 'ti ti-tool', 
      descripcion: 'Gestiona reservas y operaciones del restaurante',
      color: '#3b82f6'
    }
  ];

  return (
    <div className="inicio-container">
      <div className="inicio-fondo">
        <div className="overlay"></div>
        <div className="elementos-decorativos">
          <div className="decoracion decoracion-1"></div>
          <div className="decoracion decoracion-2"></div>
          <div className="decoracion decoracion-3"></div>
        </div>
      </div>
      
      <div className="contenido-principal">
        <div className="logo-restaurante">
          <span className="nombre">Capulí</span>
          <span className="tagline">Sabores que inspiran</span>
        </div>
        
        <div className="tarjeta-bienvenida">
          <div className="cabecera">
            <h1>Bienvenido al Restaurante Capulí</h1>
            <p>Donde cada plato cuenta una historia</p>
            <div className="divisor"></div>
            <p className="instruccion">Seleccione una opción para continuar:</p>
          </div>
          
          <div className="opciones">
            {opciones.map((opcion) => (
              <div 
                key={opcion.id}
                className={`opcion ${hoveredOption === opcion.id ? 'hovered' : ''}`}
                onClick={() => navegar(`/${opcion.id}`)}
                onMouseEnter={() => setHoveredOption(opcion.id)}
                onMouseLeave={() => setHoveredOption(null)}
                style={{ '--color-opcion': opcion.color }}
              >
                <div className="icono-container">
                  <i className={opcion.icono}></i>
                </div>
                <h3>{opcion.titulo}</h3>
                <p className="descripcion">{opcion.descripcion}</p>
                <div className="efecto-hover"></div>
              </div>
            ))}
          </div>
          
          <div className="pie">
            <div className="info-contacto">
              <p><i className="ti ti-map-pin"></i> Av. Gourmet 123, Ciudad</p>
              <p><i className="ti ti-phone"></i> (01) 234-5678</p>
              <p><i className="ti ti-clock"></i> Lun-Dom: 12:00 - 23:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inicio;