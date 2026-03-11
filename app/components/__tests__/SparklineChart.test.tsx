import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SparklineChart from '../coin/SparklineChart'

describe('SparklineChart', () => {
  it('renders an SVG element', () => {
    const { container: c } = render(<SparklineChart prices={[100, 110, 105, 120]} />)
    expect(c.querySelector('svg')).toBeInTheDocument()
  })

  it('renders a polyline path', () => {
    const { container: c } = render(<SparklineChart prices={[100, 110, 120]} />)
    expect(c.querySelector('polyline')).toBeInTheDocument()
  })

  it('uses green color when last price >= first price', () => {
    const { container: c } = render(<SparklineChart prices={[100, 110, 120]} />)
    const polyline = c.querySelector('polyline')
    expect(polyline?.getAttribute('stroke')).toBe('#a855f7')
  })

  it('uses red color when last price < first price', () => {
    const { container: c } = render(<SparklineChart prices={[120, 110, 100]} />)
    const polyline = c.querySelector('polyline')
    expect(polyline?.getAttribute('stroke')).toBe('#f87171')
  })

  it('renders nothing for empty prices array', () => {
    const { container: c } = render(<SparklineChart prices={[]} />)
    expect(c).toBeEmptyDOMElement()
  })

  it('renders min and max price labels', () => {
    render(<SparklineChart prices={[100, 200, 150]} />)
    const labels = screen.getAllByText(/\$/)
    expect(labels.length).toBeGreaterThanOrEqual(2)
  })

  it('renders the 7-day period label', () => {
    render(<SparklineChart prices={[100, 110, 120]} />)
    expect(screen.getByText(/7.day/i)).toBeInTheDocument()
  })
})
