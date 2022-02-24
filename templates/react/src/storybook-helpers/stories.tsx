import type { PropsWithChildren, ComponentType } from 'react';

import type { Story } from '@storybook/react';

// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/ban-types
export function createTemplate<P extends {}>(Component: ComponentType<P>): Story<P> {
  return (props) => <Component {...props} />;
}

// eslint-disable-next-line  @typescript-eslint/ban-types
export function createTextTemplate<P extends PropsWithChildren<{}>>(
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Component: ComponentType<P>,
): Story<P & { text?: string }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ({ text, ...props }) => <Component {...(props as any)}>{text}</Component>;
}
