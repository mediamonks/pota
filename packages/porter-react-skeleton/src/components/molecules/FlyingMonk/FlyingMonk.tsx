import { useRef } from 'react';
import { useAnimation } from 'framer-motion';
import {
  StyledFlyingMonkContainer,
  StyledFlyingMonk,
  StyledFlyingMonkControls,
} from './FlyingMonk.styles';

export default function FlyingMonk(): JSX.Element {
  const constraintsRef = useRef(null);
  const controls = useAnimation();

  return (
    <>
      <StyledFlyingMonkControls>
        <button type="button" onClick={() => controls.start({ rotate: [0, 360] })}>
          spin
        </button>
        <button type="button" onClick={() => controls.start({ scale: [0, 1] })}>
          go big
        </button>
        <button type="button" onClick={() => controls.start({ scale: [1, 0] })}>
          go small
        </button>
      </StyledFlyingMonkControls>
      <StyledFlyingMonkContainer ref={constraintsRef}>
        <StyledFlyingMonk drag animate={controls} dragConstraints={constraintsRef}>
          <img alt="flying monk" src={`${process.env.PUBLIC_URL}/favicon.ico`} />
        </StyledFlyingMonk>
      </StyledFlyingMonkContainer>
    </>
  );
}
