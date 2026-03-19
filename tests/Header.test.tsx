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
  it('highlights active nav link for /services', () => {
    vi.mocked(usePathname).mockReturnValue('/services')
    render(<Header />)

    const servicesLink = screen.getByText('Services')
    const aboutLink = screen.getByText('About')

    // Active link should have text-white (not text-white/80)
    expect(servicesLink.className).toContain('text-white')
    expect(servicesLink.className).not.toContain('text-white/80')

    // Inactive link should have text-white/80
    expect(aboutLink.className).toContain('text-white/80')
  })

  it('highlights active nav link for /about', () => {
    vi.mocked(usePathname).mockReturnValue('/about')
    render(<Header />)

    const servicesLink = screen.getByText('Services')
    const aboutLink = screen.getByText('About')

    expect(aboutLink.className).toContain('text-white')
    expect(aboutLink.className).not.toContain('text-white/80')
    expect(servicesLink.className).toContain('text-white/80')
  })

  it('shows no active state on homepage', () => {
    vi.mocked(usePathname).mockReturnValue('/')
    render(<Header />)

    const servicesLink = screen.getByText('Services')
    const aboutLink = screen.getByText('About')

    expect(servicesLink.className).toContain('text-white/80')
    expect(aboutLink.className).toContain('text-white/80')
  })

  it('renders Book a Call CTA', () => {
    vi.mocked(usePathname).mockReturnValue('/')
    render(<Header />)
    expect(screen.getByText('Book a Call')).toBeTruthy()
  })

  it('hides nav in minimal variant', () => {
    vi.mocked(usePathname).mockReturnValue('/')
    render(<Header variant="minimal" />)

    expect(screen.queryByText('Services')).toBeNull()
    expect(screen.queryByText('About')).toBeNull()
    expect(screen.queryByText('Book a Call')).toBeNull()
  })
})
