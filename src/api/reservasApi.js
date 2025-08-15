import { apiFetch } from '../services/api';

export async function getReservas() {
  return await apiFetch('/reservas', { method: 'GET' });
}
export async function createReserva(reserva) {
  return await apiFetch('/reservas', { method: 'POST', body: reserva });
}
export async function updateReserva(id, reserva) {
  return await apiFetch(`/reservas/${id}`, { method: 'PUT', body: reserva });
}
export async function deleteReserva(id) {
  return await apiFetch(`/reservas/${id}`, { method: 'DELETE' });
}

