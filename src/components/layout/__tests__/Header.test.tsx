
// src/components/layout/__tests__/Header.test.tsx
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

// Reset module cache before each test so re-mocks take effect cleanly
beforeEach(() => {
  vi.resetModules();
});

// Default mock: user has an email -> initials "AL"
vi.mock('@/hooks/useAuth', () => {
  return {
    useAuth: () => ({
      user: { email: 'alice@example.com' },
      signOut: vi.fn(),
    }),
  };
});

import { Header } from '@/components/layout/Header';

describe('Header', () => {
  it('renders brand text and shows dropdown items after opening the menu', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    // Brand text is visible
    expect(screen.getByText(/teamhub/i)).toBeInTheDocument();

    // The avatar button uses initials "AL" as its accessible name
    const avatarBtn = screen.getByRole('button', { name: /AL/i });

    // Open the dropdown menu
    await user.click(avatarBtn);

    // Now the dropdown content is rendered; query by role "menuitem"
    const directoryItem = await screen.findByRole('menuitem', { name: /directory/i });
    const signOutItem = await screen.findByRole('menuitem', { name: /sign out/i });

    expect(directoryItem).toBeInTheDocument();
    expect(signOutItem).toBeInTheDocument();
  });

  it('renders fallback "U" initials when no email is provided', async () => {
    // Re-mock useAuth for this test to return no email
    vi.doMock('@/hooks/useAuth', () => ({
      useAuth: () => ({
        user: { email: '' }, // no email -> fallback "U"
        signOut: vi.fn(),
      }),
    }));

    // Import a fresh copy of Header with the new mock applied
    const { Header: FreshHeader } = await import('@/components/layout/Header');

    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <FreshHeader />
      </MemoryRouter>
    );

    // The avatar button should now have accessible name "U"
    const avatarBtn = screen.getByRole('button', { name: /^U$/ });

    // Open the dropdown; "Sign out" should still be available
    await user.click(avatarBtn);
    const signOutItem = await screen.findByRole('menuitem', { name: /sign out/i });

    expect(avatarBtn).toBeInTheDocument();
    expect(signOutItem).toBeInTheDocument();
  });
});
``
