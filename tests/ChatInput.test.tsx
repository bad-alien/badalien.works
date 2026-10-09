import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ChatInput from '@/components/chat/ChatInput'

vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, whileHover, whileTap, transition, ...props }: any) => <button {...props}>{children}</button>,
  },
}))

describe('ChatInput prefill', () => {
  it('puts the prefill in the input, focuses it, and reports it consumed', () => {
    const onPrefillConsumed = vi.fn()
    render(<ChatInput onSend={vi.fn()} prefill="We have three AI pilots" onPrefillConsumed={onPrefillConsumed} />)

    const input = screen.getByRole('textbox', { name: 'Chat message input' }) as HTMLTextAreaElement
    expect(input.value).toBe('We have three AI pilots')
    expect(input).toHaveFocus()
    expect(onPrefillConsumed).toHaveBeenCalledTimes(1)
  })

  it('starts empty without a prefill', () => {
    render(<ChatInput onSend={vi.fn()} />)

    expect((screen.getByRole('textbox', { name: 'Chat message input' }) as HTMLTextAreaElement).value).toBe('')
  })
})
