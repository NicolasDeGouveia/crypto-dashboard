import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorMessage from '../ErrorMessage'

describe('ErrorMessage', () => {
  it('should render with default props', () => {
    render(<ErrorMessage />)

    expect(screen.getByText('Error loading data')).toBeInTheDocument()
    expect(screen.getByText('Unable to fetch data. Please try again later.')).toBeInTheDocument()
  })

  it('should render with custom title and message', () => {
    render(
      <ErrorMessage
        title="Network Error"
        message="Failed to connect to server"
      />
    )

    expect(screen.getByText('Network Error')).toBeInTheDocument()
    expect(screen.getByText('Failed to connect to server')).toBeInTheDocument()
  })
})
