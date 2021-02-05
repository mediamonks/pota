import styled from 'styled-components';
import { motion } from 'framer-motion';
import { size, position } from 'polished';

export const StyledFlyingMonkControls = styled.div`
  ${position('absolute', '5%', '5%')};
  ${size(50, 100)};

  z-index: 1;
  pointer-events: auto;
`;

export const StyledFlyingMonkContainer = styled(motion.div)`
  ${size('80%', '80%')};
  ${position('absolute', '10%', '10%')};

  border-radius: 30px;
`;

export const StyledFlyingMonk = styled(motion.div)`
  ${size(50, 50)};
  img {
    ${size('100%', '100%')};
    pointer-events: none;
  }
`;
