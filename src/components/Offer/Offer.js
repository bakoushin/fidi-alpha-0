import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../../AppContext';
import './Offer.css';

export default function Offer({ id, price, amount, comment, user }) {
  const { state } = useContext(AppContext);
  return (
    <li className="offer">
      <Link to={`/offer/${id}`}>
        <div className="offer-header">
          <div className="offer-price">{price.toFixed(2)}</div>
          <div className="offer-amount">{amount} USD</div>
        </div>
        <div className="offer-comment">{comment}</div>
        <div className="offer-user">
          <div>
            <div>Seller: {user.name === state.address ? 'You' : user.name}</div>
          </div>
        </div>
      </Link>
    </li>
  );
}
