
// src/__tests__/App.smoke.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

// Mock the auth module so App's AuthProvider doesn't hit real services
vi.mock('@/hooks/useAuth', () => {
  // Use require to avoid ESM interop issues inside vitest mocks
  const React = require('react');
  return {
    // Simple hook result used by components that call useAuth()
    useAuth: () => ({
      user: { email: 'alice@example.com' },
      signOut: vi.fn(),
    }),
    // A no-op provider so <AuthProvider> in App just renders children
    AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

// Import App after the mock so it sees the mocked module
import App from '@/App';

describe('App smoke test', () => {
  it('renders without crashing and shows a known element', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // 🔧 Adjust this assertion to something that always renders on the homepage.
    // Your Header shows "TeamHub", so this is a good stable target:
    const heading = screen.getByText(/teamhub/i);
    expect(heading).toBeInTheDocument();
  });
});
