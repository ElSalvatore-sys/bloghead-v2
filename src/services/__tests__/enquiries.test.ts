import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockEnquiry } from '@/test/mocks/data'

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

import { EnquiryService } from '../enquiries'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('EnquiryService', () => {
  describe('create', () => {
    it('inserts enquiry with sender_id', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })
      const builder = mocks.createBuilder({ data: mockEnquiry, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await EnquiryService.create({
        entity_type: 'ARTIST',
        artist_id: 'artist-1',
        enquiry_type: 'BOOKING',
        name: 'Test User',
        email: 'test@example.com',
        message: 'I would like to book you for an event.',
      })

      expect(result).toEqual(mockEnquiry)
      expect(mocks.mockFrom).toHaveBeenCalledWith('enquiries')
      expect(builder.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          sender_id: 'user-123',
          entity_type: 'ARTIST',
          artist_id: 'artist-1',
        })
      )
    })

    it('throws UnauthorizedError when not authenticated', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'No session' },
      })

      await expect(
        EnquiryService.create({
          entity_type: 'ARTIST',
          artist_id: 'artist-1',
          enquiry_type: 'BOOKING',
          name: 'Test',
          email: 'test@test.com',
          message: 'Hello',
        })
      ).rejects.toThrow('Not authenticated')
    })
  })

  describe('getBySender', () => {
    it('fetches enquiries for current user', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })
      const builder = mocks.createBuilder({ data: [mockEnquiry], error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await EnquiryService.getBySender()
      expect(result).toEqual([mockEnquiry])
      expect(builder.eq).toHaveBeenCalledWith('sender_id', 'user-123')
    })

    it('returns empty array when no enquiries', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })
      const builder = mocks.createBuilder({ data: [], error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await EnquiryService.getBySender()
      expect(result).toEqual([])
    })
  })

  describe('getForProvider', () => {
    it('queries for artist/venue owner', async () => {
      mocks.mockAuth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })

      // First call: artists lookup, second call: venues lookup, third call: enquiries query
      let callCount = 0
      mocks.mockFrom.mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          // artists lookup
          return mocks.createBuilder({ data: { id: 'artist-1' }, error: null })
        }
        if (callCount === 2) {
          // venues lookup
          return mocks.createBuilder({ data: null, error: null })
        }
        // enquiries query
        return mocks.createBuilder({ data: [mockEnquiry], error: null })
      })

      const result = await EnquiryService.getForProvider()
      expect(result).toEqual([mockEnquiry])
    })
  })

  describe('updateStatus', () => {
    it('updates the status field', async () => {
      const updatedEnquiry = { ...mockEnquiry, status: 'READ' }
      const builder = mocks.createBuilder({ data: updatedEnquiry, error: null })
      mocks.mockFrom.mockReturnValue(builder)

      const result = await EnquiryService.updateStatus('enq-1', 'READ')
      expect(result).toEqual(updatedEnquiry)
      expect(builder.update).toHaveBeenCalledWith({ status: 'READ' })
      expect(builder.eq).toHaveBeenCalledWith('id', 'enq-1')
    })
  })
})
