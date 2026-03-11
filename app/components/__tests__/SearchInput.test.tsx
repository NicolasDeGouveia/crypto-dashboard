import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import SearchInput from '../SearchInput'

const mockReplace = vi.fn()

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('q=bitcoin'),
  usePathname: () => '/',
  useRouter: () => ({ replace: mockReplace }),
}))

describe('SearchInput', () => {
  beforeEach(() => {
    mockReplace.mockClear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders with initial value from URL', async () => {
    await act(async () => {
      render(<SearchInput />)
    })
    expect(screen.getByRole('searchbox')).toHaveValue('bitcoin')
  })

  it('calls router.replace with debounced query after typing', async () => {
    render(<SearchInput />)
    const input = screen.getByRole('searchbox')

    fireEvent.change(input, { target: { value: 'eth' } })
    expect(mockReplace).not.toHaveBeenCalled()

    await act(async () => {
      vi.advanceTimersByTime(400)
    })

    expect(mockReplace).toHaveBeenCalledWith(
      expect.stringContaining('q=eth')
    )
  })

  it('resets page to 1 on new search', async () => {
    render(<SearchInput />)
    const input = screen.getByRole('searchbox')

    fireEvent.change(input, { target: { value: 'sol' } })

    await act(async () => {
      vi.advanceTimersByTime(400)
    })

    const calledUrl = mockReplace.mock.calls[0][0] as string
    expect(calledUrl).not.toContain('page=2')
  })
})
