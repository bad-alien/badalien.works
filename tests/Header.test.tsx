import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Header from '@/components/shared/Header'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}))

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ alt, ...props }: any) => <img alt={alt} {...props} />,
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div>{children}</div>,
    span: ({ children, ...props }: any) => <span>{children}</span>,
    nav: ({ children, ...props }: any) => <nav>{children}</nav>,
    button: ({ children, ...props }: any) => <button>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Mock useScrollState hook
vi.mock('@/hooks/useScrollState', () => ({
  useScrollState: () => false,
}))

import { usePathname } from 'next/navigation'

describe('Header', () => {
  it('highlights active nav link for /consult', () => {
    vi.mocked(usePathname).mockReturnValue('/consult')
    render(<Header />)

    const consultLink = screen.getByText('Consult')
    const creativeLink = screen.getByText('Creative')

    expect(consultLink.className).toContain('text-white')
    expect(consultLink.className).not.toContain('text-white/80')
    expect(creativeLink.className).toContain('text-white/80')
  })

  it('highlights active nav link for /insights', () => {
    vi.mocked(usePathname).mockReturnValue('/insights')
    render(<Header />)

    const consultLink = screen.getByText('Consult')
    const insightsLink = screen.getByText('Insights')

    expect(insightsLink.className).toContain('text-white')
    expect(insightsLink.className).not.toContain('text-white/80')
    expect(consultLink.className).toContain('text-white/80')
  })

  it('shows no active state on homepage', () => {
    vi.mocked(usePathname).mockReturnValue('/')
    render(<Header />)

    const consultLink = screen.getByText('Consult')
    const creativeLink = screen.getByText('Creative')

    expect(consultLink.className).toContain('text-white/80')
    expect(creativeLink.className).toContain('text-white/80')
  })

  it('renders Let\'s Talk CTA', () => {
    vi.mocked(usePathname).mockReturnValue('/')
    render(<Header />)
    expect(screen.getByText("Let's Talk")).toBeTruthy()
  })

  it('hides nav in minimal variant', () => {
    vi.mocked(usePathname).mockReturnValue('/')
    render(<Header variant="minimal" />)

    expect(screen.queryByText('Consult')).toBeNull()
    expect(screen.queryByText('Creative')).toBeNull()
    expect(screen.queryByText("Let's Talk")).toBeNull()
  })
})
