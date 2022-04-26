import type { AppProps } from 'next/app';

import '../styles/globals.css';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/naming-convention
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
