import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { ChatProvider } from '@/contexts/ChatContext'
import BusinessChatInterface from '@/components/chat/BusinessChatInterface'

// Mock framer-motion to avoid animation complexity in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...filterMotionProps(props)}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...filterMotionProps(props)}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

function filterMotionProps(props: Record<string, any>) {
  const filtered: Record<string, any> = {}
  for (const [key, value] of Object.entries(props)) {
    if (!['initial', 'animate', 'exit', 'transition', 'whileHover', 'whileTap', 'variants', 'viewport', 'whileInView'].includes(key)) {
      filtered[key] = value
    }
  }
  return filtered
}

function renderWithChat() {
  return render(
    <ChatProvider>
      <BusinessChatInterface />
    </ChatProvider>
  )
}

describe('BusinessChatInterface', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders initial assistant message', () => {
    renderWithChat()
    expect(screen.getByText(/I help businesses figure out where AI can actually move the needle/)).toBeTruthy()
  })

  it('shows quick action chips after initial message', () => {
    renderWithChat()
    expect(screen.getByText('How I Help')).toBeTruthy()
    expect(screen.getByText('Free Intro Call')).toBeTruthy()
    expect(screen.getByText('My Approach')).toBeTruthy()
  })

  it('sends user message and receives scripted response', async () => {
    renderWithChat()
    const input = screen.getByPlaceholderText('Ask about our services...')

    await act(async () => {
      fireEvent.change(input, { target: { value: 'Tell me about pricing' } })
      fireEvent.submit(input.closest('form')!)
    })

    // User message appears
    expect(screen.getByText('Tell me about pricing')).toBeTruthy()

    // Advance past typing delay (1-2 seconds)
    await act(async () => {
      vi.advanceTimersByTime(2500)
    })

    // Scripted response should appear (pricing keyword matched)
    expect(screen.getByText(/Pricing scales with scope/)).toBeTruthy()
  })

  it('hides quick action chips after first user message', async () => {
    renderWithChat()
    expect(screen.getByText('How I Help')).toBeTruthy()

    const input = screen.getByPlaceholderText('Ask about our services...')
    await act(async () => {
      fireEvent.change(input, { target: { value: 'hello' } })
      fireEvent.submit(input.closest('form')!)
    })

    // Quick action chips should be gone
    expect(screen.queryByText('How I Help')).toBeNull()
  })

  it('disables input while typing indicator is active', async () => {
    renderWithChat()
    const input = screen.getByPlaceholderText('Ask about our services...')

    await act(async () => {
      fireEvent.change(input, { target: { value: 'hello' } })
      fireEvent.submit(input.closest('form')!)
    })

    // Input should be disabled during typing
    expect(input).toHaveProperty('disabled', true)

    // Advance past typing delay
    await act(async () => {
      vi.advanceTimersByTime(2500)
    })

    // Input should be re-enabled
    expect(input).toHaveProperty('disabled', false)
  })

  it('does not send empty messages', async () => {
    renderWithChat()
    const input = screen.getByPlaceholderText('Ask about our services...')
    const initialMessageCount = screen.getAllByText(/./i).length

    await act(async () => {
      fireEvent.change(input, { target: { value: '   ' } })
      fireEvent.submit(input.closest('form')!)
    })

    // No new messages should appear
    expect(screen.getAllByText(/./i).length).toBe(initialMessageCount)
  })
})
