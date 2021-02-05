import { render, screen } from '@testing-library/react';
import App from './App';

// TODO: fix this test and add friends
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/save to reload/i);
  expect(linkElement).toBeInTheDocument();
});
