import styled, { CSSObject } from 'styled-components';

// casting the object as `CSSObject` for correctness and auto-completion
const config = {
  h1: { fontSize: 32 } as CSSObject,
  h2: { fontSize: 24 } as CSSObject,
  h3: { fontSize: 18 } as CSSObject,
  h4: { fontSize: 16 } as CSSObject,
  h5: { fontSize: 13 } as CSSObject,
  h6: { fontSize: 10 } as CSSObject,
} as const;

/**
 * Used to define the custom configuration for the headings.
 */
export type HeadingType = keyof typeof config;

/**
 * These types are available for the heading component. Keep in mind that by default the type also
 * defines the tag that is used to render out the component. So if you choose to use the type `h2`
 * it will also render out a `<h2>` tag.
 */
export type StyledHeadingProps = {
  type: HeadingType;
};

export const StyledHeading = styled.h1<StyledHeadingProps>`
  ${(p) => config[p.type]};

  margin: 0;
`;
