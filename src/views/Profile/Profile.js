import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../../AppContext';
import Deal from '../../components/Deal/Deal';
import Offer from '../../components/Offer/Offer';
import Spinner from '../../components/Spinner/Spinner';
import ConnectWallet from '../../components/ConnectWallet/ConnectWallet';
import InputInfo from '../../components/InputInfo/InputInfo';
import './Profile.css';

export default function Profile() {
  const { state } = useContext(AppContext);

  if (state.loading) {
    return (
      <div className="center">
        <Spinner />
      </div>
    );
  }

  if (!state.address) {
    return (
      <div>
        <ConnectWallet />
        <InputInfo type="bottom">
          Connect your wallet to access your profile
        </InputInfo>
      </div>
    );
  }

  const offers = state.offers.filter(
    (offer) => offer.user.name === state.address
  );

  const purchases = state.deals.filter((deal) => deal.buyer === state.address);
  const sales = state.deals.filter(
    (deal) => deal.seller.name === state.address
  );
  const deals = [...purchases, ...sales];

  const total =
    offers.reduce((p, offer) => p + offer.collateral, 0) +
    purchases.reduce((p, deal) => p + deal.deposit, 0);

  const locked =
    purchases.reduce((p, deal) => p + deal.deposit, 0) +
    sales.reduce((p, deal) => p + deal.collateral, 0);

  const available = total - locked;

  return (
    <div>
      <h2>Address</h2>
      <div>{state.address}</div>
      <h2>Balance</h2>
      <div>
        Total: <span className="strong">{Number(total.toFixed(2))}</span> cUSD
      </div>
      <div>
        Locked in deals:{' '}
        <span className="strong">{Number(locked.toFixed(2))}</span> cUSD
      </div>
      <div>
        Redeemable:{' '}
        <span className="strong">{Number(available.toFixed(2))}</span> cUSD
      </div>
      {state.deals.length > 0 && (
        <React.Fragment>
          <h2>Deals in progress</h2>
          <ul className="deals">
            {deals.map((deal) => {
              const { id, amount, buyer } = deal;
              const status = buyer === state.address ? 'PURCHASE' : 'SALE';
              return <Deal key={id} id={id} amount={amount} status={status} />;
            })}
          </ul>
        </React.Fragment>
      )}

      <h2>My offers</h2>
      <Link to="/add" className="link">
        Add offer
      </Link>
      {state.offers && state.offers.length > 0 && (
        <ul className="offers">
          {state.offers
            .filter(({ user }) => user.name === state.address)
            .filter(({ amount }) => amount > 0)
            .sort((a, b) => b.price - a.price)
            .sort((a, b) => b.amount - a.amount)
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
      )}
    </div>
  );
}
