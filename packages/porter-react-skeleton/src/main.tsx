import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { configure } from 'mobx';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { GlobalStoreProvider } from './GlobalStore';
import GlobalStyle from './GlobalStyle';
import theme from './config/theme';

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
