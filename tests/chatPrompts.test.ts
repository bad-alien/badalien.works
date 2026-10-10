import { describe, it, expect } from 'vitest'
import { FAQ_SYSTEM_PROMPT } from '@/lib/chatPrompts'
import { services } from '@/data/services'
import { caseStudies } from '@/data/caseStudies'

describe('FAQ system prompt', () => {
  it('describes exactly the services and work the site shows', () => {
    for (const service of services) expect(FAQ_SYSTEM_PROMPT).toContain(service.title)
    for (const study of caseStudies) expect(FAQ_SYSTEM_PROMPT).toContain(study.title)
  })

  it('carries no prices', () => {
    expect(FAQ_SYSTEM_PROMPT).not.toMatch(/\$\s?\d/)
  })
})
