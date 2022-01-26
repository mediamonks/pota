import ReactDOM from 'react-dom';
import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { configure } from 'mobx';

import App from './components/unlisted/App';
import GlobalStyle from './components/unlisted/GlobalStyle';
import { GlobalStoreProvider } from './stores/global';
import theme from './config/theme';


import * as serviceWorkerRegistration from "./serviceWorkerRegistration"
import reportWebVitals from './reportWebVitals';

/** SETUP */

configure({
  // restricts observable value updating only to actions
  enforceActions: 'observed',
});

/** RENDER */

ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GlobalStoreProvider>
          <>
            <GlobalStyle />
            <App />
          </>
        </GlobalStoreProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
  // eslint-disable-next-line unicorn/prefer-query-selector
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();
