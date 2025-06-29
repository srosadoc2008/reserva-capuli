import React, { useEffect, useState } from 'react';
import '../styles/listaReservas.css';

// Componente que muestra y gestiona la lista de reservas
function ListaReservas() {
  const [reservas, setReservas] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');

  // Cargar las reservas desde el localStorage cuando se monta el componente
  useEffect(() => {
    const datos = JSON.parse(localStorage.getItem('reservas')) || [];
    setReservas(datos);
  }, []);

  // Función para cancelar una reserva (cambia su estado a "Cancelada")
  const cancelarReserva = (id) => {
    const actualizadas = reservas.map((r) =>
      r.id === id ? { ...r, estado: 'Cancelada' } : r
    );
    setReservas(actualizadas);
    localStorage.setItem('reservas', JSON.stringify(actualizadas));
  };

  // Filtrar las reservas según nombre, estado y fecha
  const reservasFiltradas = reservas.filter((reserva) => {
    const coincideBusqueda = reserva.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideEstado = filtroEstado === 'todas' || reserva.estado === filtroEstado;
    const coincideFecha = !filtroFecha || reserva.fecha === filtroFecha;
    return coincideBusqueda && coincideEstado && coincideFecha;
  });

  // Exportar las reservas filtradas a un archivo CSV
  const exportarCSV = () => {
    const encabezado = ['Nombre', 'Teléfono', 'Fecha', 'Hora', 'Personas', 'Mesa', 'Código', 'Estado'];
    const filas = reservasFiltradas.map((r) => [
      r.nombre,
      r.telefono,
      r.fecha,
      r.hora,
      r.personas,
      r.mesa,
      r.codigo || '-',
      r.estado
    ]);

    const csvContent = [encabezado, ...filas]
      .map((fila) => fila.map((valor) => `"${valor}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const enlace = document.createElement('a');
    enlace.setAttribute('href', url);
    enlace.setAttribute('download', 'reservas.csv');
    enlace.click();
  };

  return (
    <div className="lista-reservas">
      <h2>Gestión de Reservas</h2>

      {/* Filtros: búsqueda por nombre, fecha y estado */}
      <div className="filtros">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <input
          type="date"
          value={filtroFecha}
          onChange={(e) => setFiltroFecha(e.target.value)}
        />
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="todas">Todas</option>
          <option value="Confirmada">Confirmadas</option>
          <option value="Cancelada">Canceladas</option>
        </select>
      </div>

      {/* Botón para exportar la tabla filtrada */}
      <div style={{ textAlign: 'right', marginBottom: '10px' }}>
        <button className="exportar-btn" onClick={exportarCSV}>
          Exportar a CSV
        </button>
      </div>

      {/* Tabla de reservas */}
      <div className="tabla-scroll">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Personas</th>
              <th>Mesa</th>
              <th>Código</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {reservasFiltradas.map((reserva) => (
              <tr key={reserva.id}>
                <td>{reserva.nombre}</td>
                <td>{reserva.telefono}</td>
                <td>{reserva.fecha}</td>
                <td>{reserva.hora}</td>
                <td>{reserva.personas}</td>
                <td>{reserva.mesa}</td>
                <td>{reserva.codigo || '-'}</td>
                <td>{reserva.estado}</td>
                <td>
                  {reserva.estado === 'Confirmada' ? (
                    <button className="cancelar-btn" onClick={() => cancelarReserva(reserva.id)}>
                      Cancelar
                    </button>
                  ) : (
                    '-' // Aquí podría ir "Reactivar" si se activa esa mejora
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default ListaReservas;
