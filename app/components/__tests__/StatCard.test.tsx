import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatCard } from '../StatCard'

describe('StatCard', () => {
  it('should render label and value', () => {
    render(<StatCard label="Current Price" value="$50,000.00" />)

    expect(screen.getByText('Current Price')).toBeInTheDocument()
    expect(screen.getByText('$50,000.00')).toBeInTheDocument()
  })
})
