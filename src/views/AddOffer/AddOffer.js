import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import AppContext from '../../AppContext';
import { deposit } from '../../api';
import ConnectWallet from '../../components/ConnectWallet/ConnectWallet';
import Spinner from '../../components/Spinner/Spinner';
import InputInfo from '../../components/InputInfo/InputInfo';
import InlineError from '../../components/InlineError/InlineError';
import Buttons from '../../components/Buttons/Buttons';
import './AddOffer.css';

export default function AcceptOffer() {
  const history = useHistory();
  const { state, dispatch } = useContext(AppContext);
  const [isSaving, setIsSaving] = useState(false);

  const { register, watch, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const { amount, price, comment } = data;
    const depositAmount = Number((2 * amount * price).toFixed(2));

    setIsSaving(true);
    try {
      await window.web3.eth.personal.sign(
        `Deposit ${depositAmount} USD`,
        state.address
      );
      const { id } = await deposit({
        deposit: depositAmount,
        address: state.address,
        amount,
        price,
        comment
      });
      dispatch({
        type: 'DEPOSIT',
        id,
        amount: Number(amount),
        collateral: depositAmount,
        price: Number(price),
        comment
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

  let error = false;

  const defaultAmount = '';
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
    }
  }

  const defaultPrice = '';
  const price = watch('price', defaultPrice);

  let priceError = null;
  {
    const numericValue = Number(price.replace(',', '.'));
    if (numericValue === 0) {
      priceError = <InputInfo error={true}>Specify price</InputInfo>;
      error = true;
    } else if (Number.isNaN(numericValue)) {
      priceError = <InputInfo error={true}>Invalid price</InputInfo>;
      error = true;
    }
  }

  if (!state.address) {
    return (
      <div>
        <ConnectWallet />
        <InputInfo type="bottom">
          Connect your wallet to create offers
        </InputInfo>
      </div>
    );
  }

  return (
    <div>
      <h2>Create new offer</h2>
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="amount">Amount in USD</label>
        <div style={{ position: 'relative' }}>
          <input
            id="amount"
            name="amount"
            className="offer-input"
            type="number"
            step="any"
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
        <label htmlFor="price">Price</label>
        <div style={{ position: 'relative' }}>
          <input
            id="price"
            name="price"
            className="offer-input"
            type="number"
            step="any"
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
          {priceError}
        </div>
        <label htmlFor="comment">Comment</label>
        <div style={{ position: 'relative' }}>
          <input
            id="comment"
            name="comment"
            className="offer-input"
            type="text"
            ref={register}
            disabled={isSaving}
          ></input>
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
                    <span> {(2 * amount * price).toFixed(2)} cUSD</span>
                  )}
                </button>
                <InputInfo type="bottom">
                  The collateral will be locked until a deal is completed
                </InputInfo>
              </div>

              <Link to="/" className="link">
                Cancel
              </Link>
            </React.Fragment>
          )}
        </Buttons>
      </form>
    </div>
  );
}
