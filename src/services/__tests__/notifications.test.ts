import { describe, it, expect, vi, beforeEach } from 'vitest'

const mocks = vi.hoisted(() => {
  const fn = vi.fn
  function createBuilder(result?: { data?: unknown; error?: unknown; count?: number | null }) {
    const r = { data: result?.data ?? null, error: result?.error ?? null, count: result?.count ?? null }
    const b: Record<string, any> = {}
    for (const m of ['select','eq','neq','is','in','ilike','gte','lte','order','range','limit','or','insert','update','delete','single','maybeSingle','abortSignal'])
      b[m] = fn().mockReturnValue(b)
    b.then = (resolve: (v: any) => void) => { resolve(r); return b }
    return b as Record<string, ReturnType<typeof vi.fn>> & { then: unknown }
  }
  const mockQueryBuilder = createBuilder()
  const mockFrom = fn().mockReturnValue(mockQueryBuilder)
  const mockAuth = {
    getUser: fn().mockResolvedValue({ data: { user: null }, error: null }),
    getSession: fn().mockResolvedValue({ data: { session: null }, error: null }),
    signInWithPassword: fn(),
    signUp: fn(),
    signOut: fn(),
    signInWithOAuth: fn(),
    resetPasswordForEmail: fn(),
    updateUser: fn(),
    onAuthStateChange: fn().mockReturnValue({ data: { subscription: { unsubscribe: fn() } } }),
  }
  const mockStorageBucket = {
    upload: fn().mockResolvedValue({ data: { path: 'test/path' }, error: null }),
    remove: fn().mockResolvedValue({ data: [], error: null }),
    getPublicUrl: fn().mockReturnValue({ data: { publicUrl: 'https://test.supabase.co/storage/v1/object/public/bucket/test' } }),
  }
  const mockStorage = { from: fn().mockReturnValue(mockStorageBucket) }
  const mockFunctions = { invoke: fn().mockResolvedValue({ data: { id: 'mock-resend-id' }, error: null }) }
  const mockRpc = fn().mockResolvedValue({ data: [], error: null })
  return {
    supabase: { from: mockFrom, auth: mockAuth, storage: mockStorage, functions: mockFunctions, rpc: mockRpc },
    mockFrom, mockQueryBuilder, mockAuth, mockStorage, mockStorageBucket, mockFunctions, mockRpc, createBuilder,
  }
})

vi.mock('@/services/supabase', () => ({ supabase: mocks.supabase }))

import { NotificationService } from '../notifications'

const mockNotification = {
  id: 'notif-1',
  user_id: 'user-123',
  type: 'message_received' as const,
  title: 'New message',
  body: 'You have a new message',
  data: {},
  link: '/messages',
  read_at: null,
  created_at: '2024-01-15T10:00:00Z',
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('NotificationService', () => {
  describe('create', () => {
    it('inserts notification', async () => {
      const builder = mocks.createBuilder({ data: null, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      await NotificationService.create({
        user_id: 'user-123',
        type: 'message_received',
        title: 'New message',
        body: 'You have a new message',
        link: '/messages',
      })

      expect(mocks.mockFrom).toHaveBeenCalledWith('notifications')
      expect(builder.insert).toHaveBeenCalled()
    })
  })

  describe('getUnread', () => {
    it('filters by read_at IS NULL', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })
      const builder = mocks.createBuilder({ data: [mockNotification], error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await NotificationService.getUnread()

      expect(mocks.mockFrom).toHaveBeenCalledWith('notifications')
      expect(builder.is).toHaveBeenCalledWith('read_at', null)
      expect(result).toEqual([mockNotification])
    })
  })

  describe('markRead', () => {
    it('updates read_at', async () => {
      const readNotification = { ...mockNotification, read_at: '2024-01-15T12:00:00Z' }
      const builder = mocks.createBuilder({ data: readNotification, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await NotificationService.markRead('notif-1')

      expect(mocks.mockFrom).toHaveBeenCalledWith('notifications')
      expect(builder.update).toHaveBeenCalled()
      expect(builder.eq).toHaveBeenCalledWith('id', 'notif-1')
      expect(result.read_at).toBeTruthy()
    })
  })

  describe('markAllRead', () => {
    it('updates all unread for user', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })
      const builder = mocks.createBuilder({ data: null, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      await NotificationService.markAllRead()

      expect(mocks.mockFrom).toHaveBeenCalledWith('notifications')
      expect(builder.update).toHaveBeenCalled()
      expect(builder.eq).toHaveBeenCalledWith('user_id', 'user-123')
      expect(builder.is).toHaveBeenCalledWith('read_at', null)
    })
  })
})
