import React from 'react';
import { Link } from 'react-router-dom';
import './Deal.css';

export default function Deal({ id, amount, status }) {
  return (
    <li className="deal">
      <Link to={`/deal/${id}`}>
        <div className="deal-header">
          <div>
            In progress: <span className="deal-amount">{amount}</span> USD
          </div>
          <div className="deal-status">{status}</div>
        </div>
      </Link>
    </li>
  );
}
