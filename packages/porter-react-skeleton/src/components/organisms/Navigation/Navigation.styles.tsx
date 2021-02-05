import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const StyledNav = styled.nav`
  display: flex;
  align-items: center;
  padding: 20px;

  ul {
    list-style: none;

    display: flex;

    padding: 0;
    margin: 0;
    li {
      padding: 10px;
    }
  }
`;

export const StyledNavItem = styled(Link)`
  &:hover {
    color: red;
  }
`;
