import { ComponentType } from 'react';

export type HeadingType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type HeadingProps = {
  type: HeadingType;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  as?: keyof JSX.IntrinsicElements | ComponentType<any>;
  forwardedAs?: keyof JSX.IntrinsicElements | ComponentType<any>;
  /* eslint-enable  */
};
