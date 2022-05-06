import { forwardRef, PropsWithChildren, Ref } from 'react';

import { StyledHeading } from './Heading.styles';
import { HeadingProps } from './Heading.types';

function HeadingComponent(
  { type, as = type, ...props }: PropsWithChildren<HeadingProps>,
  ref: Ref<HTMLHeadingElement>,
) {
  return <StyledHeading ref={ref} type={type} as={as} {...props} />;
}

// typings for `forwardRef` seem to be messed up, so have to pass the element and props types again
export const Heading = forwardRef<HTMLHeadingElement, PropsWithChildren<HeadingProps>>(
  HeadingComponent,
);
