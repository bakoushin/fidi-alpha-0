import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import AppContext from '../../AppContext';
import { getState } from '../../api';
import { ReactComponent as ProfileIcon } from './profile.svg';
import './Header.css';

export default function Header() {
  const { dispatch } = useContext(AppContext);
  const history = useHistory();
  const handleHeaderClick = () => {
    dispatch({
      type: 'SET_LOADING',
      loading: true
    });

    getState().then((state) => {
      dispatch({
        type: 'SET_STATE',
        state
      });
      dispatch({
        type: 'SET_LOADING',
        loading: false
      });
      history.push('/');
    });
  };
  return (
    <React.Fragment>
      <header className="app-header">
        <div className="main-header">
          <h1 className="app-header__text" onClick={handleHeaderClick}>
            FIDI.CASH
          </h1>
          <Link to="/profile" className="app-header__icon">
            <ProfileIcon />
          </Link>
        </div>
        <div className="sub-header">Cash out your crypto and back</div>
      </header>
    </React.Fragment>
  );
}
