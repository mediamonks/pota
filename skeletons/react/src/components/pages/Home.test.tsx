import { render, screen } from '@testing-library/react';
import Home from './Home';

test('renders the heading', () => {
  render(<Home />);
  const heading = screen.getByText(/Home/);

  expect(heading).toBeInTheDocument();
});
