import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock firebase/functions
vi.mock('firebase/functions', () => ({
  getFunctions: vi.fn(() => ({})),
  httpsCallable: vi.fn(() => vi.fn()),
}))

vi.mock('../../utils/firebase', () => ({ default: {} }))

import { getFunctions, httpsCallable } from 'firebase/functions'

describe('OpenRouterService', () => {
  let OpenRouterService

  beforeEach(async () => {
    vi.clearAllMocks()

    // Reset module cache to re-run the module-level code
    vi.resetModules()

    const module = await import('../OpenRouterService.js')
    OpenRouterService = module.default
  })

  it('exports a service instance', () => {
    expect(OpenRouterService).toBeDefined()
    expect(typeof OpenRouterService.makeRequest).toBe('function')
  })

  it('has all expected AI methods', () => {
    expect(typeof OpenRouterService.generateMotivationalQuote).toBe('function')
    expect(typeof OpenRouterService.prioritizeTasks).toBe('function')
    expect(typeof OpenRouterService.generateProductivityInsights).toBe('function')
    expect(typeof OpenRouterService.breakdownGoal).toBe('function')
    expect(typeof OpenRouterService.recommendHabits).toBe('function')
    expect(typeof OpenRouterService.analyzeMeetingNotes).toBe('function')
    expect(typeof OpenRouterService.optimizeSchedule).toBe('function')
  })

  it('generateMotivationalQuote returns fallback on error', async () => {
    // httpsCallable returns a function that rejects
    const mockCallable = vi.fn().mockRejectedValue(new Error('fail'))
    vi.mocked(httpsCallable).mockReturnValue(mockCallable)

    // Need to re-import after re-mocking
    vi.resetModules()

    const mod = await import('../OpenRouterService.js')
    const service = mod.default

    const result = await service.generateMotivationalQuote()
    expect(result).toHaveProperty('text')
    expect(result).toHaveProperty('author')
  })

  it('prioritizeTasks returns empty array on error', async () => {
    vi.resetModules()

    const mockCallable = vi.fn().mockRejectedValue(new Error('fail'))
    vi.mocked(httpsCallable).mockReturnValue(mockCallable)

    const mod = await import('../OpenRouterService.js')
    const service = mod.default

    const result = await service.prioritizeTasks([{ id: '1', title: 'Test' }])
    expect(result).toEqual({ prioritized: [] })
  })

  it('generateProductivityInsights returns empty insights on error', async () => {
    vi.resetModules()

    const mockCallable = vi.fn().mockRejectedValue(new Error('fail'))
    vi.mocked(httpsCallable).mockReturnValue(mockCallable)

    const mod = await import('../OpenRouterService.js')
    const service = mod.default

    const result = await service.generateProductivityInsights({ score: 50 })
    expect(result).toEqual({ insights: [] })
  })
})
