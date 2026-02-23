import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/contexts/CartContext', () => ({
  useCart: vi.fn(() => ({ cart: { itemCount: 0 } })),
}));

// Button from shadcn needs no special mock — jsdom renders it fine
vi.mock('@/lib/utils', () => ({
  cn: (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(' '),
}));

import { useCart } from '@/contexts/CartContext';
import { CartIcon } from '@/components/cart/CartIcon';

const mockUseCart = vi.mocked(useCart);

describe('CartIcon', () => {
  it('renders without crashing when onClick is omitted', () => {
    expect(() => render(<CartIcon />)).not.toThrow();
  });

  it('renders without crashing when onClick is provided', () => {
    expect(() => render(<CartIcon onClick={() => {}} />)).not.toThrow();
  });

  it('shows no badge when itemCount is 0', () => {
    mockUseCart.mockReturnValue({ cart: { itemCount: 0 } } as any);
    render(<CartIcon />);
    expect(screen.queryByText('0')).toBeNull();
  });

  it('shows badge when itemCount is positive', () => {
    mockUseCart.mockReturnValue({ cart: { itemCount: 3 } } as any);
    render(<CartIcon />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('shows 99+ when itemCount exceeds 99', () => {
    mockUseCart.mockReturnValue({ cart: { itemCount: 100 } } as any);
    render(<CartIcon />);
    expect(screen.getByText('99+')).toBeInTheDocument();
  });
});
