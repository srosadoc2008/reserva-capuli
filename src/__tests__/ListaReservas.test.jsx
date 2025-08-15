// src/__tests__/ListaReservas.test.jsx
import React from 'react';
import userEvent from '@testing-library/user-event';
import ListaReservas from '../components/ListaReservas';
import { render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react';

jest.mock('react-router-dom', () => ({
  useNavigate: () => () => {},
}), { virtual: true });

const mockFetch = (data) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => data,
  });
};

describe('ListaReservas - filtros y render', () => {
  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  const dataset = [
    { id: 1, nombre: 'Ana',   telefono: '111', fecha: '2025-08-12', hora: '19:00', personas: 2, mesa: 'M1', codigo: 'A1', estado: 'Confirmada' },
    { id: 2, nombre: 'Bruno', telefono: '222', fecha: '2025-08-12', hora: '20:00', personas: 4, mesa: 'M2', codigo: 'B2', estado: 'Pendiente'  },
    { id: 3, nombre: 'Carla', telefono: '333', fecha: '2025-08-13', hora: '18:00', personas: 3, mesa: 'M3', codigo: 'C3', estado: 'Cancelada'  },
    { id: 4, nombre: 'Ana María', telefono: '444', fecha: '2025-08-13', hora: '21:00', personas: 5, mesa: 'M4', codigo: 'A4', estado: 'Confirmada' },
  ];

  test('render inicial con datos del servidor', async () => {
    mockFetch(dataset);
    render(<ListaReservas />);

    await waitFor(() => {
      expect(screen.getByText('Ana')).toBeInTheDocument();
    });

    expect(screen.getByText('Bruno')).toBeInTheDocument();
    expect(screen.getByText('Carla')).toBeInTheDocument();
    expect(screen.getByText('Ana María')).toBeInTheDocument();
  });

  test('filtra por nombre (búsqueda)', async () => {
    mockFetch(dataset);
    render(<ListaReservas />);

    const inputBusqueda = await screen.findByPlaceholderText('Buscar por nombre...');
    await userEvent.clear(inputBusqueda);
    await userEvent.type(inputBusqueda, 'ana'); // 'Ana' y 'Ana María'

    await waitFor(() => {
      expect(screen.getByText('Ana')).toBeInTheDocument();
      expect(screen.getByText('Ana María')).toBeInTheDocument();
    });

    expect(screen.queryByText('Bruno')).toBeNull();
    expect(screen.queryByText('Carla')).toBeNull();
  });

  test('filtra por estado', async () => {
    mockFetch(dataset);
    render(<ListaReservas />);

    // Único <select> en el formulario
    const selectEstado = await screen.findByRole('combobox');

    await userEvent.selectOptions(selectEstado, 'Confirmada');
    await waitFor(() => {
      expect(screen.getByText('Ana')).toBeInTheDocument();
      expect(screen.getByText('Ana María')).toBeInTheDocument();
    });
    expect(screen.queryByText('Bruno')).toBeNull();
    expect(screen.queryByText('Carla')).toBeNull();

    await userEvent.selectOptions(selectEstado, 'Pendiente');
    await waitFor(() => {
      expect(screen.getByText('Bruno')).toBeInTheDocument();
    });
    expect(screen.queryByText('Ana')).toBeNull();
    expect(screen.queryByText('Ana María')).toBeNull();
    expect(screen.queryByText('Carla')).toBeNull();
  });

  test('filtra por fecha', async () => {
    mockFetch(dataset);
    render(<ListaReservas />);

    // Selecciona específicamente el input de fecha por CSS (más robusto en jsdom)
    const inputFecha = document.querySelector('input[type="date"]');
    expect(inputFecha).toBeTruthy(); // aseguramos que existe

    // 2025-08-12 → deben aparecer Ana y Bruno
    fireEvent.change(inputFecha, { target: { value: '2025-08-12' } });

    await waitFor(() => {
        expect(screen.getByText('Ana')).toBeInTheDocument();
        expect(screen.getByText('Bruno')).toBeInTheDocument();
    });
    expect(screen.queryByText('Carla')).toBeNull();
    expect(screen.queryByText('Ana María')).toBeNull();

    // Cambia a 2025-08-13 → Carla y Ana María
    fireEvent.change(inputFecha, { target: { value: '2025-08-13' } });

    await waitFor(() => {
        expect(screen.getByText('Carla')).toBeInTheDocument();
        expect(screen.getByText('Ana María')).toBeInTheDocument();
    });
    expect(screen.queryByText('Ana')).toBeNull();
    expect(screen.queryByText('Bruno')).toBeNull();
    });

});
