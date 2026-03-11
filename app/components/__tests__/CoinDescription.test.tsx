import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CoinDescription from '../coin/CoinDescription'

describe('CoinDescription', () => {
  it('renders description text', () => {
    render(<CoinDescription description="Bitcoin is the first cryptocurrency." />)
    expect(screen.getByText(/Bitcoin is the first/)).toBeInTheDocument()
  })

  it('strips HTML tags from description', () => {
    render(<CoinDescription description="<p>Bitcoin is <strong>decentralized</strong>.</p>" />)
    expect(screen.getByText(/Bitcoin is decentralized/)).toBeInTheDocument()
    expect(document.querySelector('strong')).not.toBeInTheDocument()
  })

  it('renders nothing when description is empty', () => {
    const { container } = render(<CoinDescription description="" />)
    expect(container).toBeEmptyDOMElement()
  })

  it('truncates long descriptions with Read more', () => {
    const long = 'A'.repeat(600)
    render(<CoinDescription description={long} />)
    expect(screen.getByText('Read more')).toBeInTheDocument()
  })

  it('does not show Read more for short descriptions', () => {
    render(<CoinDescription description="Short text." />)
    expect(screen.queryByText('Read more')).not.toBeInTheDocument()
  })
})
