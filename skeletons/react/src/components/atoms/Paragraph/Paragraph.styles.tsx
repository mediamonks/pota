import styled, { CSSObject } from 'styled-components';

const weightConfig = {
  regular: 400,
  bold: 600,
} as const;

/**
 * Used to define the custom configuration for the paragraph weights.
 */
export type ParagraphWeight = keyof typeof weightConfig;

// casting the object as `CSSObject` for correctness and auto-completion
const sizeConfig = {
  small: { fontSize: 14, lineHeight: 20 / 14 } as CSSObject,
  medium: { fontSize: 18, lineHeight: 22 / 18 } as CSSObject,
} as const;

/**
 * Used to define the custom configuration for the paragraph sizes.
 */
export type ParagraphSize = keyof typeof sizeConfig;

export interface StyledParagraphProps {
  size?: ParagraphSize;
  weight?: ParagraphWeight;
}

export const StyledParagraph = styled.p<StyledParagraphProps>`
  ${(p) => sizeConfig[p.size ?? 'medium']};
  font-weight: ${(p) => weightConfig[p.weight ?? 'regular']};

  text-transform: none;
  margin: 0;
`;
