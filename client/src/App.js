import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import MainNav from './components/Navigation/MainNav';

import './App.css';

import Auth from './pages/Auth';
import Events from './pages/Events';
import Bookings from './pages/Bookings';

class App extends Component {
  render() { 
    return (
      <BrowserRouter>
        <React.Fragment>
          <MainNav />
          <main className="main-content">
              <Switch>
                <Redirect from="/" to="/auth" component={Auth} exact />
                <Route path="/auth" component={Auth} />
                <Route path="/events" component={Events} />
                <Route path="/bookings" component={Bookings} />
              </Switch>
            </main>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
