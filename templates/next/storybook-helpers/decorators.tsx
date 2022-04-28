import { ThemeProvider } from 'styled-components';
import type { Story } from '@storybook/react';
import { theme, GlobalStyle } from '../theme';

// eslint-disable-next-line @typescript-eslint/naming-convention
export function themeDecorator(StoryComponent: Story): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <StoryComponent />
    </ThemeProvider>
  );
}
