import { render, screen } from '@testing-library/react';
import App from './App';

test('muestra la marca y el reproductor', () => {
  render(<App />);
  expect(screen.getAllByText(/Radio Colmena/i).length).toBeGreaterThan(0);
  expect(screen.getByRole('button', { name: /reproducir radio/i })).toBeInTheDocument();
});
