import { createGlobalStyle } from 'styled-components';
import { size } from 'polished';

export default createGlobalStyle`
  html {
    max-width: 70ch;
    padding: 3em 1em;
    margin: auto;
    line-height: 1.75;
    font-size: 1.25em;
  }
`;
