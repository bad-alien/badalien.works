import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { ChatProvider, useChat } from '@/contexts/ChatContext'
import { ReactNode } from 'react'

function wrapper({ children }: { children: ReactNode }) {
  return <ChatProvider>{children}</ChatProvider>
}

describe('ChatContext', () => {
  it('throws when useChat is called outside ChatProvider', () => {
    expect(() => {
      renderHook(() => useChat())
    }).toThrow('useChat must be used within a ChatProvider')
  })

  it('provides initial assistant message', () => {
    const { result } = renderHook(() => useChat(), { wrapper })
    expect(result.current.messages).toHaveLength(1)
    expect(result.current.messages[0].role).toBe('assistant')
    expect(result.current.messages[0].id).toBe('initial')
  })

  it('initializes with chat minimized', () => {
    const { result } = renderHook(() => useChat(), { wrapper })
    expect(result.current.chatView).toBe('minimized')
  })
})
