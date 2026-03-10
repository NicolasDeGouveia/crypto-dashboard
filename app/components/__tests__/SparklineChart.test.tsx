import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
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
    expect(polyline?.getAttribute('stroke')).toMatch(/emerald|green|#/i)
  })

  it('uses red color when last price < first price', () => {
    const { container: c } = render(<SparklineChart prices={[120, 110, 100]} />)
    const polyline = c.querySelector('polyline')
    expect(polyline?.getAttribute('stroke')).toMatch(/red|#/i)
  })

  it('renders nothing for empty prices array', () => {
    const { container: c } = render(<SparklineChart prices={[]} />)
    expect(c).toBeEmptyDOMElement()
  })
})
