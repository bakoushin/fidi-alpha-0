import React, { useEffect, useReducer } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Offers from './views/Offers/Offers';
import Deals from './views/Deals/Deals';
import CloseDeal from './views/CloseDeal/CloseDeal';
import AddOffer from './views/AddOffer/AddOffer';
import Offer from './views/Offer/Offer';
import Profile from './views/Profile/Profile';

import AppContext from './AppContext';
import { reducer, initialState } from './AppReducer';
import { getState } from './api';
import './App.css';

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
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
    });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <Router>
        <Header />
        <Switch>
          <Route path="/deal/:id">
            <CloseDeal />
          </Route>
          <Route path="/offer/:id">
            <Offer />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/add">
            <AddOffer />
          </Route>
          <Route path="/">
            <div>
              {state.deals.length > 0 && <Deals />}
              <Offers />
            </div>
          </Route>
        </Switch>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
