import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock redis before importing the action (env vars not available in tests)
vi.mock('@/app/_lib/redis', () => ({
  authRatelimit: {
    limit: vi.fn().mockResolvedValue({ success: true }),
  },
}))

// Mock next/headers
vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}))

// Mock db before importing the action
vi.mock('@/app/_lib/db', () => ({
  db: {
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([]),
      }),
    }),
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([{ id: 'user-1', email: 'test@example.com' }]),
      }),
    }),
  },
}))

vi.mock('@node-rs/argon2', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('$argon2id$hashed'),
    verify: vi.fn().mockResolvedValue(true),
  },
}))

// Mock signIn from auth — it throws NEXT_REDIRECT so we just spy on it
vi.mock('@/app/_lib/auth', () => ({
  signIn: vi.fn().mockRejectedValue(new Error('NEXT_REDIRECT')),
  auth: vi.fn().mockResolvedValue(null),
}))

import { register } from '../auth'
import { authRatelimit } from '@/app/_lib/redis'

describe('register Server Action', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(authRatelimit.limit).mockResolvedValue({ success: true } as never)
  })

  it('returns INVALID_EMAIL for bad email format', async () => {
    const formData = new FormData()
    formData.set('email', 'not-an-email')
    formData.set('password', 'password123')
    const result = await register(formData)
    expect(result).toEqual({ success: false, error: 'INVALID_EMAIL' })
  })

  it('returns PASSWORD_TOO_SHORT for password < 8 chars', async () => {
    const formData = new FormData()
    formData.set('email', 'test@example.com')
    formData.set('password', 'short')
    const result = await register(formData)
    expect(result).toEqual({ success: false, error: 'PASSWORD_TOO_SHORT' })
  })

  it('returns EMAIL_IN_USE when email already exists', async () => {
    const { db } = await import('@/app/_lib/db')
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([{ id: 'existing', email: 'test@example.com' }]),
      }),
    } as never)

    const formData = new FormData()
    formData.set('email', 'test@example.com')
    formData.set('password', 'password123')
    const result = await register(formData)
    expect(result).toEqual({ success: false, error: 'EMAIL_IN_USE' })
  })

  it('returns RATE_LIMITED when rate limit exceeded', async () => {
    vi.mocked(authRatelimit.limit).mockResolvedValue({ success: false } as never)

    const formData = new FormData()
    formData.set('email', 'test@example.com')
    formData.set('password', 'password123')
    const result = await register(formData)
    expect(result).toEqual({ success: false, error: 'RATE_LIMITED' })
  })
})
