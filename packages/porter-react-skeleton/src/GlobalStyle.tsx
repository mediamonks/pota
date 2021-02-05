import { createGlobalStyle } from 'styled-components';
import { size } from 'polished';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji;
    background: ${(p) => p.theme.color.white};
    color: ${(p) => p.theme.color.black};

    ${size('100vh', '100%')};
    margin: 0;
    padding: 0;

     // uncomment for "dark mode" support
    /* @media screen and (prefers-color-scheme: dark) {
      background: ${(p) => p.theme.color.black};
      color: ${(p) => p.theme.color.white};
    }  */
  }

  #root {
    ${size('100%', '100%')};
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export default GlobalStyle;
