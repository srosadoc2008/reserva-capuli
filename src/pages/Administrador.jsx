import React, { useState } from 'react';
import Login from '../components/Login';
import PanelAdmin from '../components/PanelAdmin';

function Administrador() {
  const [acceso, setAcceso] = useState(false);

  return (
    <div>
      {acceso ? (
        <PanelAdmin onCerrarSesion={() => setAcceso(false)} />
      ) : (
        <Login onLoginExitoso={() => setAcceso(true)} />
      )}
    </div>
  );
}

export default Administrador;

