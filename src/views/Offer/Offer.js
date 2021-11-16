import React, { useState, useContext } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import AppContext from '../../AppContext';
import { buy, cancelOffer } from '../../api';
import ConnectWallet from '../../components/ConnectWallet/ConnectWallet';
import Spinner from '../../components/Spinner/Spinner';
import InputInfo from '../../components/InputInfo/InputInfo';
import InlineError from '../../components/InlineError/InlineError';
import Buttons from '../../components/Buttons/Buttons';
import './Offer.css';

export default function Offer() {
  const history = useHistory();
  const { state, dispatch } = useContext(AppContext);
  const [isSaving, setIsSaving] = useState(false);
  const { register, watch, handleSubmit } = useForm();
  const { id } = useParams();

  const offer = state.offers.find((offer) => offer.id === id);

  const onSubmit = async (data) => {
    const { amount } = data;
    const depositAmount = Number(((3 * amount) / offer.price).toFixed(2));

    setIsSaving(true);
    try {
      await window.web3.eth.personal.sign(
        `Deposit ${depositAmount} USD`,
        state.address
      );
      const result = await buy({
        deposit: depositAmount,
        offer: id,
        amount
      });
      dispatch({
        type: 'BUY',
        offerId: id,
        dealId: result.id,
        address: state.address,
        deposit: depositAmount,
        collateral: Number(((2 * amount) / offer.price).toFixed(2)),
        amount,
        comment
      });
      dispatch({
        type: 'SAVE_STATE'
      });

      history.push('/');
    } catch (error) {
      let errorValue = String(error);
      if (typeof error === 'object') {
        errorValue = JSON.stringify(error);
      }
      setErrorMessage(errorValue);
      console.error(errorValue);
    }
    setIsSaving(false);
  };

  const handleCancelOffer = async () => {
    setIsSaving(true);
    try {
      const redeemAmount = Number((2 * offer.amount * offer.price).toFixed(2));
      await window.web3.eth.personal.sign(
        `Redeem ${redeemAmount} USD`,
        state.address
      );
      await cancelOffer({
        offer: id,
        amount
      });
      dispatch({
        type: 'CANCEL_OFFER',
        id,
        amount: redeemAmount
      });
      dispatch({
        type: 'SAVE_STATE'
      });

      history.push('/profile');
    } catch (error) {
      let errorValue = String(error);
      if (typeof error === 'object') {
        errorValue = JSON.stringify(error);
      }
      setErrorMessage(errorValue);
      console.error(errorValue);
    }
    setIsSaving(false);
  };

  const [errorMessage, setErrorMessage] = useState(null);
  const onErrorDismiss = () => setErrorMessage(null);

  if (!offer) {
    return <div>Not found</div>;
  }

  if (!state.address) {
    return (
      <div>
        <ConnectWallet />
        <InputInfo type="bottom">
          Connect your wallet to make purchases
        </InputInfo>
      </div>
    );
  }

  let error = false;

  const defaultAmount = String(offer.amount);
  const amount = watch('amount', defaultAmount);

  let amountError = null;
  {
    const numericValue = Number(amount.replace(',', '.'));
    if (numericValue === 0) {
      amountError = <InputInfo error={true}>Specify amount</InputInfo>;
      error = true;
    } else if (Number.isNaN(numericValue)) {
      amountError = <InputInfo error={true}>Invalid amount</InputInfo>;
      error = true;
    } else if (numericValue > offer.amount) {
      amountError = <InputInfo error={true}>Too much</InputInfo>;
      error = true;
    }
  }

  const comment = watch('comment', '');

  let commentError = null;

  if (!comment) {
    commentError = <InputInfo error={true}>Please specify</InputInfo>;
    error = true;
  }

  return (
    <div>
      <h2>Offer</h2>
      <div className="offer-details">
        <div className="user">
          <div>From:</div>
          <div>{offer.user.name}</div>
        </div>
        <div className="avalable-amount">
          <span className="strong">{offer.amount}</span> USD available
        </div>
        <div className="label">Exchange rate</div>
        <div>
          <span className="strong">{offer.price}</span> USD for
          <span className="strong"> 1</span> cUSD
        </div>
      </div>
      {offer.user.name === state.address && offer.amount > 0 && (
        <div className="block">
          <button type="button" className="button" onClick={handleCancelOffer}>
            Cancel offer
          </button>
          <InputInfo type="bottom">
            Redeem {Number((2 * offer.amount * offer.price).toFixed(2))} cUSD
            collateral
          </InputInfo>
        </div>
      )}
      {offer.user.name !== state.address && offer.amount > 0 && (
        <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="amount">Purchase amount in USD</label>
          <div style={{ position: 'relative' }}>
            <input
              id="amount"
              name="amount"
              className="offer-input"
              type="number"
              step="any"
              defaultValue={defaultAmount}
              rules={{
                required: true,
                validate: (value) => {
                  const numericValue = Number(value);
                  if (Number.isNaN(numericValue)) return false;
                  if (numericValue === 0) return false;
                  return true;
                }
              }}
              ref={register}
              disabled={isSaving}
            ></input>
            {amountError}
          </div>
          <InputInfo type="bottom">
            You will have to deposit 2x extra cUSD as a collateral
          </InputInfo>
          <label htmlFor="comment">How to deliver your purchase</label>
          <div style={{ position: 'relative' }}>
            <input
              id="comment"
              name="comment"
              className="offer-input"
              type="text"
              rules={{
                required: true
              }}
              ref={register}
              disabled={isSaving}
            ></input>
            {commentError}
          </div>
          <Buttons>
            {isSaving && <Spinner />}
            {!isSaving && (
              <React.Fragment>
                <InlineError text={errorMessage} onDismiss={onErrorDismiss} />
                <div className="block">
                  <button type="submit" className="button" disabled={error}>
                    Deposit
                    {amount && (
                      <span>
                        {' '}
                        {((3 * amount) / offer.price).toFixed(2)} cUSD
                      </span>
                    )}
                  </button>
                  {amount && (
                    <InputInfo type="bottom">
                      Your payment {(amount / offer.price).toFixed(2)} cUSD +
                      collateral {((2 * amount) / offer.price).toFixed(2)} cUSD
                    </InputInfo>
                  )}
                </div>

                <Link to="/" className="link">
                  Cancel
                </Link>
              </React.Fragment>
            )}
          </Buttons>
        </form>
      )}
    </div>
  );
}
