-- =============================================
-- Migration: 021_performance_indexes
-- Description: Add missing indexes for performance optimization
-- Author: Phase 17 - Performance Optimization
-- Date: 2026-02-10
-- =============================================

-- Index for filtering enquiries by status
-- Used by: EnquiriesPage to filter pending enquiries
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);

-- Index for filtering notifications by type
-- Used by: NotificationsPage to filter by notification type
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- Composite index for booking_requests filtering
-- Used by: BookingsPage to fetch user's bookings filtered by status
-- Covers common query pattern: WHERE requester_id = ? AND status = ? ORDER BY created_at DESC
CREATE INDEX IF NOT EXISTS idx_booking_requests_requester_status
  ON booking_requests(requester_id, status, created_at DESC);

-- Verify indexes were created successfully
DO $$
BEGIN
  RAISE NOTICE 'Performance indexes created successfully:';
  RAISE NOTICE '- idx_enquiries_status';
  RAISE NOTICE '- idx_notifications_type';
  RAISE NOTICE '- idx_booking_requests_requester_status';
END $$;
