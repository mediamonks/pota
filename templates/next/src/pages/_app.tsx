import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';

import { theme, GlobalStyle } from '../theme';

// eslint-disable-next-line @typescript-eslint/naming-convention
export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
