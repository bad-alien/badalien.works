import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import HeroInteractive from '@/components/home/HeroInteractive'

// Mock next/link as a plain anchor
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

// Mock framer-motion: strip animation props, keep DOM props so events work
const stripMotion = ({ variants, initial, animate, transition, whileInView, viewport, ...rest }: any) => rest
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...stripMotion(props)}>{children}</div>,
    p: ({ children, ...props }: any) => <p {...stripMotion(props)}>{children}</p>,
    nav: ({ children, ...props }: any) => <nav {...stripMotion(props)}>{children}</nav>,
    button: ({ children, ...props }: any) => <button {...stripMotion(props)}>{children}</button>,
  },
  useReducedMotion: () => false,
}))

describe('HeroInteractive', () => {
  it('renders the three section links as real anchors', () => {
    render(<HeroInteractive onActivateChat={vi.fn()} onLearnMore={vi.fn()} />)

    expect(screen.getByRole('link', { name: 'Consult' })).toHaveAttribute('href', '/consult')
    expect(screen.getByRole('link', { name: 'Creative' })).toHaveAttribute('href', '/creative')
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact')
  })

  it('opens chat from the ghost input by click and by keyboard', () => {
    const onActivateChat = vi.fn()
    render(<HeroInteractive onActivateChat={onActivateChat} onLearnMore={vi.fn()} />)

    const input = screen.getByRole('button', { name: 'Start a chat' })
    fireEvent.click(input)
    fireEvent.keyDown(input, { key: 'Enter' })
    fireEvent.keyDown(input, { key: ' ' })

    expect(onActivateChat).toHaveBeenCalledTimes(3)
  })

  it('does not open chat when a key is typed anywhere on the page', () => {
    const onActivateChat = vi.fn()
    render(<HeroInteractive onActivateChat={onActivateChat} onLearnMore={vi.fn()} />)

    fireEvent.keyDown(window, { key: 'a' })
    fireEvent.keyDown(document.body, { key: 'h' })

    expect(onActivateChat).not.toHaveBeenCalled()
  })

  it('calls onLearnMore from the learn more button', () => {
    const onLearnMore = vi.fn()
    render(<HeroInteractive onActivateChat={vi.fn()} onLearnMore={onLearnMore} />)

    fireEvent.click(screen.getByRole('button', { name: /learn more/i }))

    expect(onLearnMore).toHaveBeenCalledTimes(1)
  })
})
