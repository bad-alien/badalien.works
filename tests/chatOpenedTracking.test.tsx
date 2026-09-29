import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { ReactNode } from 'react'

const trackConversion = vi.fn()
vi.mock('@/lib/analytics', () => ({ trackConversion: (...args: unknown[]) => trackConversion(...args) }))

import { ChatProvider, useChat } from '@/contexts/ChatContext'

function wrapper({ children }: { children: ReactNode }) {
  return <ChatProvider>{children}</ChatProvider>
}

describe('Chat Opened tracking', () => {
  beforeEach(() => trackConversion.mockClear())

  it('does not fire on mount (chat starts minimized)', () => {
    renderHook(() => useChat(), { wrapper })
    expect(trackConversion).not.toHaveBeenCalled()
  })

  it('fires once per open with the entry point set just before opening', () => {
    const { result } = renderHook(() => useChat(), { wrapper })

    act(() => {
      result.current.setEntryPoint('widget')
      result.current.openChat()
    })
    expect(trackConversion).toHaveBeenCalledTimes(1)
    expect(trackConversion).toHaveBeenCalledWith('Chat Opened', { entry: 'widget' })

    // Changing entry point while already open must not re-fire
    act(() => result.current.setEntryPoint('page'))
    expect(trackConversion).toHaveBeenCalledTimes(1)

    // Minimize then reopen counts as a second open
    act(() => result.current.minimizeChat())
    act(() => result.current.openChat())
    expect(trackConversion).toHaveBeenCalledTimes(2)
    expect(trackConversion).toHaveBeenLastCalledWith('Chat Opened', { entry: 'page' })
  })
})
