import { forwardRef, PropsWithChildren, Ref } from 'react';

import { StyledParagraph, StyledParagraphProps } from './Paragraph.styles';

export type ParagraphProps = StyledParagraphProps;

function Paragraph(props: PropsWithChildren<StyledParagraphProps>, ref: Ref<HTMLParagraphElement>) {
  return <StyledParagraph ref={ref} {...props} />;
}

// typings for `forwardRef` seem to be messed up, so have to pass the element and props types again
export default forwardRef<HTMLParagraphElement, PropsWithChildren<StyledParagraphProps>>(Paragraph);
