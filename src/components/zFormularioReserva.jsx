import React, { useState, useCallback, useMemo } from 'react';
import { getReservas, createReserva } from '../api/reservasApi';
import '../styles/formularioReserva.css';

/* ===================== VALIDACIONES ===================== */
function parseISODateOnly(value) {
  const [y, m, d] = (value || '').split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

function isFutureOrToday(dateStr) {
  const d = parseISODateOnly(dateStr);
  if (!d) return false;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return d.getTime() >= today.getTime();
}

function isValidTime24h(timeStr) {
  const [hh, mm] = (timeStr || '').split(':').map(Number);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return false;
  if (hh < 0 || hh > 23) return false;
  if (mm < 0 || mm > 59) return false;
  const minutes = hh * 60 + mm;
  const min = 13 * 60; // 13:00
  const max = 22 * 60; // 22:00
  return minutes >= min && minutes <= max;
}

function isValidPartySize(n) {
  const val = Number(n);
  return Number.isInteger(val) && val >= 1 && val <= 10;
}

function isDuplicateReserva(nueva, existentesRaw) {
  // ✅ BLINDAJE: si no es array, conviértelo a []
  const existentes = Array.isArray(existentesRaw) ? existentesRaw : [];

  const nombre = (nueva?.nombre || '').trim().toLowerCase();
  const fecha = (nueva?.fecha || '').trim();
  const hora = (nueva?.hora || '').trim();
  if (!nombre || !fecha || !hora) return false;

  return existentes.some(r =>
    (r?.nombre || '').trim().toLowerCase() === nombre &&
    (r?.fecha || '').trim() === fecha &&
    (r?.hora || '').trim() === hora
  );
}

function validateReserva(input, existentes) {
  const errors = {};
  if (!isFutureOrToday(input?.fecha)) {
    errors.fecha = 'La fecha debe ser hoy o posterior.';
  }
  if (!isValidTime24h(input?.hora)) {
    errors.hora = 'La hora debe estar entre 1:00 p.m. y 10:00 p.m.';
  }
  if (!isValidPartySize(input?.comensales)) {
    errors.comensales = 'La cantidad de personas debe estar entre 1 y 10.';
  }
  if (isDuplicateReserva(input, existentes)) {
    errors.duplicado = 'Ya existe una reserva con el mismo nombre, fecha y hora.';
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

/* =================== COMPONENTE =================== */
export default function FormularioReserva({ reservas, onCreated }) {
  const [form, setForm] = useState({ nombre: '', fecha: '', hora: '', comensales: 1 });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // ✅ min para bloquear fechas pasadas en el UI
  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const disabled = useMemo(() => {
    return (!form.nombre || !form.fecha || !form.hora || !form.comensales || submitting);
  }, [form.nombre, form.fecha, form.hora, form.comensales, submitting]);

  const setField = useCallback((k, v) => {
    setForm(prev => ({ ...prev, [k]: v }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    // ✅ Obtener existentes de forma robusta
    let existentes = [];
    if (Array.isArray(reservas)) {
      existentes = reservas;
    } else {
      const resp = await getReservas();
      // resp puede ser {ok, data, ...} o algo distinto -> blinda:
      if (resp && Array.isArray(resp.data)) existentes = resp.data;
      else if (Array.isArray(resp)) existentes = resp;
      else existentes = [];
    }

    const { valid, errors: errs } = validateReserva(form, existentes);
    setErrors(errs);
    if (!valid) return;

    setSubmitting(true);
    const { ok, data, error } = await createReserva({
      ...form,
      comensales: Number(form.comensales),
    });
    setSubmitting(false);

    if (!ok) {
      setErrors(prev => ({ ...prev, submit: error?.message || 'Error al crear la reserva' }));
      return;
    }

    setForm({ nombre: '', fecha: '', hora: '', comensales: 1 });
    setErrors({});
    onCreated && onCreated(data);
  }, [form, reservas, onCreated]);

  return (
    <form onSubmit={handleSubmit} aria-busy={submitting}>
      <div className="campo">
        <label htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          value={form.nombre}
          onChange={(e) => setField('nombre', e.target.value)}
          required
        />
      </div>

      <div className="campo">
        <label htmlFor="fecha">Fecha</label>
        <input
          id="fecha"
          type="date"
          min={todayISO}              // ✅ bloquea fechas pasadas en el selector
          value={form.fecha}
          onChange={(e) => setField('fecha', e.target.value)}
          required
        />
        {errors.fecha && <small style={{ color: 'crimson' }}>{errors.fecha}</small>}
      </div>

      <div className="campo">
        <label htmlFor="hora">Hora</label>
        <input
          id="hora"
          type="time"
          min="13:00"
          max="22:00"
          value={form.hora}
          onChange={(e) => setField('hora', e.target.value)}
          required
        />
        {errors.hora && <small style={{ color: 'crimson' }}>{errors.hora}</small>}
      </div>

      <div className="campo">
        <label htmlFor="comensales">Personas</label>
        <input
          id="comensales"
          type="number"
          min={1}
          max={10}
          value={form.comensales}
          onChange={(e) => setField('comensales', Number(e.target.value))}
          required
        />
        {errors.comensales && <small style={{ color: 'crimson' }}>{errors.comensales}</small>}
      </div>

      {errors.duplicado && (
        <div role="alert" style={{ color: 'crimson' }}>
          {errors.duplicado}
        </div>
      )}
      {errors.submit && (
        <div role="alert" style={{ color: 'crimson' }}>
          {errors.submit}
        </div>
      )}

      <button type="submit" disabled={disabled}>
        {submitting ? 'Guardando…' : 'Reservar'}
      </button>
    </form>
  );
}
