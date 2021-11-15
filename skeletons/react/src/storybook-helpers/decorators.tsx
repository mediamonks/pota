import { ThemeProvider } from 'styled-components';
import type { Story } from '@storybook/react';
import theme from '../config/theme';
import { GlobalStoreProvider } from '../stores/global';
import GlobalStyle from '../components/unlisted/GlobalStyle';

// eslint-disable-next-line @typescript-eslint/naming-convention
export function themeDecorator(StoryComponent: Story): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <>
        <GlobalStyle />
        <StoryComponent />
      </>
    </ThemeProvider>
  );
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function globalStoreDecorator(StoryComponent: Story): JSX.Element {
  return (
    <GlobalStoreProvider>
      <StoryComponent />
    </GlobalStoreProvider>
  );
}
