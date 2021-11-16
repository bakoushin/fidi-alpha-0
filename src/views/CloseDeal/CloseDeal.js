import React, { useState, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import AppContext from '../../AppContext';
import { closeDeal } from '../../api';
import ConnectWallet from '../../components/ConnectWallet/ConnectWallet';
import Spinner from '../../components/Spinner/Spinner';
import InputInfo from '../../components/InputInfo/InputInfo';
import InlineError from '../../components/InlineError/InlineError';
import Buttons from '../../components/Buttons/Buttons';
import './CloseDeal.css';

export default function AcceptOffer() {
  const history = useHistory();
  const { state, dispatch } = useContext(AppContext);
  const [isSaving, setIsSaving] = useState(false);
  const { id } = useParams();

  const [errorMessage, setErrorMessage] = useState(null);
  const onErrorDismiss = () => setErrorMessage(null);

  const deal = state.deals.find((deal) => deal.id === id);

  if (!deal) {
    return <div>Not found</div>;
  }

  if (!state.address) {
    return (
      <div>
        <ConnectWallet />
        <InputInfo type="bottom">
          Connect your wallet to work with deals
        </InputInfo>
      </div>
    );
  }

  const { amount, price, seller, buyer, collateral, comment } = deal;
  const stake = Number(((2 * amount) / price).toFixed(2));

  const handleConfirmReceipt = async () => {
    setIsSaving(true);
    try {
      await window.web3.eth.personal.sign(`Claim ${stake} cUSD`, state.address);
      await closeDeal({
        id
      });
      dispatch({
        type: 'CLOSE',
        id,
        stake
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

  return (
    <div>
      {buyer === state.address ? (
        <React.Fragment>
          <h2>Purchase in progress</h2>
          <div className="deal-details">
            {seller.name} should send you
            <span className="strong"> {amount}</span> USD
          </div>
          <div>
            <span className="strong">{collateral}</span> cUSD is locked upon
            closing the deal
          </div>
          <Buttons>
            {isSaving && <Spinner />}
            {!isSaving && (
              <React.Fragment>
                <InlineError text={errorMessage} onDismiss={onErrorDismiss} />
                <div className="block">
                  <button
                    type="button"
                    onClick={handleConfirmReceipt}
                    className="button"
                  >
                    Confirm receipt
                  </button>

                  <InputInfo type="bottom">
                    This will unlock your {stake} cUSD stake
                  </InputInfo>
                </div>
              </React.Fragment>
            )}
          </Buttons>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <h2>Sale in progress</h2>
          <div className="deal-details">
            <div>Your buyer is: {buyer}</div>
            <br />
            <div>
              <span className="strong">{collateral}</span> cUSD is locked upon
              closing the deal
            </div>
            <br />
            Please send <span className="strong"> {amount}</span> USD following
            their instructions:
            <div className="strong">{comment}</div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
