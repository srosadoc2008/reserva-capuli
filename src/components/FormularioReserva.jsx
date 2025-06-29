import React, { useState } from 'react';
import '../styles/formularioReserva.css';

// Componente del formulario de reservas del cliente
function FormularioReserva({ onReservaConfirmada }) {
  // Estados para cada campo del formulario
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [personas, setPersonas] = useState('');
  const [mesa, setMesa] = useState('');
  const [error, setError] = useState('');

  // Función para generar un código aleatorio tipo ABC-1234
  const generarCodigoConfirmacion = () => {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numeros = '0123456789';
    let codigo = '';

    for (let i = 0; i < 3; i++) {
      codigo += letras.charAt(Math.floor(Math.random() * letras.length));
    }

    codigo += '-';

    for (let i = 0; i < 4; i++) {
      codigo += numeros.charAt(Math.floor(Math.random() * numeros.length));
    }

    return codigo;
  };

  // Función principal que se ejecuta al enviar el formulario
  const manejarEnvio = (e) => {
    e.preventDefault(); // Evita que la página se recargue

    // Verificamos si ya existe una reserva con la misma mesa, fecha y hora
    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    const conflicto = reservas.find(
      (r) => r.fecha === fecha && r.hora === hora && r.mesa === mesa
    );

    if (conflicto) {
      setError('La mesa ya está reservada en ese horario.');
      return;
    }

    // Creamos la nueva reserva con todos los datos ingresados
    const nuevaReserva = {
      id: Date.now(),
      nombre,
      telefono,
      fecha,
      hora,
      personas,
      mesa,
      estado: 'Confirmada', // por defecto, toda nueva reserva es confirmada
      codigo: generarCodigoConfirmacion()
    };

    // Guardamos la reserva en el localStorage
    const actualizadas = [...reservas, nuevaReserva];
    localStorage.setItem('reservas', JSON.stringify(actualizadas));

    // Informamos al componente padre que la reserva fue realizada
    onReservaConfirmada(nuevaReserva);

    // Limpiamos los campos del formulario
    setNombre('');
    setTelefono('');
    setFecha('');
    setHora('');
    setPersonas('');
    setMesa('');
    setError('');
  };

  return (
    <div className="contenedor-formulario">

      <form className="formulario-reserva" onSubmit={manejarEnvio}>
        <h2>Reservar Mesa</h2>

        <label>Nombre:</label>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <label>Teléfono:</label>
        <input
          type="tel"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
          pattern="[0-9]{9}"
          title="Ingrese un número de 9 dígitos"
        />

        <label>Fecha:</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />

        <label>Hora:</label>
        <input
          type="time"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          required
        />

        <label>Número de personas:</label>
        <input
          type="number"
          min="1"
          value={personas}
          onChange={(e) => setPersonas(e.target.value)}
          required
        />

        <label>Número de mesa:</label>
        <select value={mesa} onChange={(e) => setMesa(e.target.value)} required>
          <option value="">Seleccionar mesa</option>
          <option value="1">Mesa 1</option>
          <option value="2">Mesa 2</option>
          <option value="3">Mesa 3</option>
          <option value="4">Mesa 4</option>
          <option value="5">Mesa 5</option>
          <option value="6">Mesa 6</option>
        </select>

        <button type="submit">Confirmar Reserva</button>

        {/* Mostrar mensaje de error si hay conflicto */}
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </form>
  </div>
  );
}

export default FormularioReserva;
