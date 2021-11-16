import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../../AppContext';
import Spinner from '../../components/Spinner/Spinner';
import Offer from '../../components/Offer/Offer';
import './Offers.css';

export default function Offers() {
  const { state } = useContext(AppContext);

  if (state.loading) {
    return (
      <div className="center">
        <Spinner />
      </div>
    );
  }

  if (!state.offers) {
    return null;
  }

  return (
    <div>
      <h2>Offers for cUSD ⬌ USD</h2>
      <Link to="/add" className="link">
        Add offer
      </Link>
      <ul className="offers">
        {state.offers
          .filter(({ amount }) => amount > 0)
          .sort((a, b) => b.price - a.price)
          .map((offer) => {
            const { id, price, amount, comment, user } = offer;
            return (
              <Offer
                key={id}
                id={id}
                price={price}
                amount={amount}
                comment={comment}
                user={user}
              />
            );
          })}
      </ul>
    </div>
  );
}
