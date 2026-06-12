import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, renderHook } from '@testing-library/react'

// Mock firebase/auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  onAuthStateChanged: vi.fn((auth, callback) => {
    // Simulate async auth state
    setTimeout(() => callback(null), 10)
    return vi.fn() // unsubscribe
  }),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  signInWithPopup: vi.fn(),
  updateProfile: vi.fn(),
}))

vi.mock('../../utils/firebase', () => ({
  auth: {},
  db: {},
  default: {},
}))

import { AuthProvider, useAuth } from '../AuthContext'

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders children after loading finishes', async () => {
    render(
      <AuthProvider>
        <div data-testid="child">Hello</div>
      </AuthProvider>
    )

    // Children are not rendered immediately because loading=true
    expect(screen.queryByTestId('child')).not.toBeInTheDocument()

    // Wait for the simulated async callback
    await waitFor(() => {
      expect(screen.getByTestId('child')).toBeInTheDocument()
    })
  })

  it('provides null user when not authenticated', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.currentUser).toBe(null)
  })

  it('useAuth throws if used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // renderHook without wrapper throws
    expect(() => {
      renderHook(() => useAuth())
    }).toThrow('useAuth must be used within an AuthProvider')

    consoleSpy.mockRestore()
  })
})
