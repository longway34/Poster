import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Appbar from './components/Appbar.js';
import Routes from './routes/index'
import './App.css';
import StartUpContainer from './containers/StartUpContainer'
import { ConfirmProvider } from 'material-ui-confirm'

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <ConfirmProvider>
          <CssBaseline />
          <StartUpContainer >
            <Appbar />
            <Routes />
          </StartUpContainer>
        </ConfirmProvider>
      </React.Fragment>
    );
  }
}

export default App;
