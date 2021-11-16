import React, { useContext } from 'react';
import AppContext from '../../AppContext';
import Deal from '../../components/Deal/Deal';
import './Deals.css';

export default function Deals() {
  const { state } = useContext(AppContext);

  if (state.loading) {
    return <div>Loading</div>;
  }

  if (!state.address) {
    return null;
  }

  const deals = state.deals.filter(
    (deal) => deal.buyer === state.address || deal.seller.name === state.address
  );

  if (deals.length === 0) {
    return null;
  }

  return (
    <div>
      <h2>Deals in progress</h2>
      <ul className="deals">
        {deals.map((deal) => {
          const { id, amount, buyer } = deal;
          const status = buyer === state.address ? 'PURCHASE' : 'SALE';
          return <Deal key={id} id={id} amount={amount} status={status} />;
        })}
      </ul>
    </div>
  );
}
