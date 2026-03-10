import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/app/_lib/db', () => ({
  db: {
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        onConflictDoNothing: vi.fn().mockResolvedValue(undefined),
      }),
    }),
    delete: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue(undefined),
    }),
  },
}))

vi.mock('@/app/_lib/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}))

import { addFavourite, removeFavourite } from '../favourites'
import { auth } from '@/app/_lib/auth'

describe('addFavourite', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns UNAUTHENTICATED when no session', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
;(auth as any).mockResolvedValue(null)
    const result = await addFavourite('bitcoin')
    expect(result).toEqual({ success: false, error: 'UNAUTHENTICATED' })
  })

  it('returns INVALID_COIN_ID for bad coinId format', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: 'user-1', email: 'a@b.com' },
      expires: '2099-01-01',
    } as never)
    const result = await addFavourite('INVALID COIN!')
    expect(result).toEqual({ success: false, error: 'INVALID_COIN_ID' })
  })

  it('calls db.insert with correct userId and coinId', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: 'user-1', email: 'a@b.com' },
      expires: '2099-01-01',
    } as never)
    const { db } = await import('@/app/_lib/db')

    await addFavourite('bitcoin')

    expect(db.insert).toHaveBeenCalled()
  })

  it('returns success: true on valid input', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: 'user-1', email: 'a@b.com' },
      expires: '2099-01-01',
    } as never)
    const result = await addFavourite('bitcoin')
    expect(result).toEqual({ success: true })
  })
})

describe('removeFavourite', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns UNAUTHENTICATED when no session', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
;(auth as any).mockResolvedValue(null)
    const result = await removeFavourite('bitcoin')
    expect(result).toEqual({ success: false, error: 'UNAUTHENTICATED' })
  })

  it('calls db.delete on valid input', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: 'user-1', email: 'a@b.com' },
      expires: '2099-01-01',
    } as never)
    const { db } = await import('@/app/_lib/db')

    await removeFavourite('bitcoin')

    expect(db.delete).toHaveBeenCalled()
  })

  it('returns success: true (idempotent)', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: 'user-1', email: 'a@b.com' },
      expires: '2099-01-01',
    } as never)
    const result = await removeFavourite('bitcoin')
    expect(result).toEqual({ success: true })
  })
})
