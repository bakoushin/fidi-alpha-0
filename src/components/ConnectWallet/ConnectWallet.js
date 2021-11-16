import React, { useContext } from 'react';
import Web3 from 'web3';
import AppContext from '../../AppContext';

export default function Wallet() {
  const { state, dispatch } = useContext(AppContext);

  const handleConnectWallet = async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    window.web3 = new Web3(window.ethereum);

    const accounts = await window.web3.eth.getAccounts();
    const address = accounts[0];

    dispatch({
      type: 'SET_ADDRESS',
      address
    });
  };

  if (!state.address) {
    return (
      <button type="button" className="button" onClick={handleConnectWallet}>
        Connect wallet
      </button>
    );
  }

  return <div>{state.address}</div>;
}
