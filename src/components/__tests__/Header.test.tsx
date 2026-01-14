import { describe, it, expect } from 'vitest';

import { render, screen } from '@testing-library/react';
import React from 'react';


function Header() {
  return <h1>People Hub</h1>;
}

describe('Header', () => {
  it('renders app title', () => {
    render(<Header />);
    expect(screen.getByText(/people hub/i)).toBeInTheDocument();
  });
});
