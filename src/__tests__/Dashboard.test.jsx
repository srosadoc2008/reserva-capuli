// src/__tests__/Dashboard.test.jsx
import React from 'react';
import { render, screen, waitFor, cleanup, within } from '@testing-library/react';
import Dashboard from '../components/Dashboard';

// Mock virtual del router (evita resolver ESM en Jest)
jest.mock('react-router-dom', () => ({
  useNavigate: () => () => {},
}), { virtual: true });

// Helper para mockear fetch
const mockFetch = (data) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => data,
  });
};

describe('Dashboard KPIs', () => {
  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  test('muestra KPIs correctos con data', async () => {
    const dataset = [
      { id: 1, estado: 'Confirmada', fecha: '2025-08-12', hora: '19:00' },
      { id: 2, estado: 'Confirmada', fecha: '2025-08-12', hora: '20:00' },
      { id: 3, estado: 'Pendiente',  fecha: '2025-08-13', hora: '18:00' },
      { id: 4, estado: 'Cancelada',  fecha: '2025-08-14', hora: '21:00' },
    ];
    mockFetch(dataset);

    render(<Dashboard />);

    // Espera a que el total cambie de 0 a 4 tras el fetch
    await waitFor(() => {
      const cardTotal = screen.getByText('Reservas totales').closest('.stat-card');
      expect(within(cardTotal).getByText('4')).toBeInTheDocument();
    });

    // Confirma las otras tarjetas, también con espera/reconsulta
    await waitFor(() => {
      const cardConf = screen.getByText('Reservas confirmadas').closest('.stat-card');
      expect(within(cardConf).getByText('2')).toBeInTheDocument();
    });

    await waitFor(() => {
      const cardPend = screen.getByText('Reservas pendientes').closest('.stat-card');
      expect(within(cardPend).getByText('1')).toBeInTheDocument();
    });

    await waitFor(() => {
      const cardCanc = screen.getByText('Reservas canceladas').closest('.stat-card');
      expect(within(cardCanc).getByText('1')).toBeInTheDocument();
    });
  });

  test('muestra aviso cuando no hay reservas', async () => {
    mockFetch([]); // lista vacía

    render(<Dashboard />);

    // Verifica el aviso y el total 0 tras el fetch vacío
    await waitFor(() => {
      expect(screen.getByText('No hay reservas para mostrar.')).toBeInTheDocument();
      const cardTotal = screen.getByText('Reservas totales').closest('.stat-card');
      expect(within(cardTotal).getByText('0')).toBeInTheDocument();
    });
  });
});
