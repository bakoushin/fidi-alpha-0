import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../AppContext';

export default function Balance() {
  const { state } = useContext(AppContext);

  if (!state.address) {
    return null;
  }

  const { total, locked } = state.balance;
  const available = total - locked;

  return (
    <div>
      <div>
        {available} / {total}
      </div>
      <Link to={`/deposit`}>Add funds</Link>
    </div>
  );
}
