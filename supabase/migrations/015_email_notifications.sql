-- ============================================================
-- Migration 015: Email Notification System
-- Adds email_preferences + email_logs tables for Phase 12
-- ============================================================

-- Email notification preferences per user
CREATE TABLE email_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  booking_emails boolean DEFAULT true,
  message_emails boolean DEFAULT true,
  marketing_emails boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS: users can only read/update their own preferences
ALTER TABLE email_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own email preferences"
  ON email_preferences FOR ALL
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- Email send log for debugging/tracking/deduplication
CREATE TABLE email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email text NOT NULL,
  recipient_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  template text NOT NULL,
  subject text NOT NULL,
  status text DEFAULT 'sent',
  resend_id text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Index for deduplication + rate limiting queries
CREATE INDEX idx_email_logs_dedup
  ON email_logs (recipient_id, template, created_at DESC);

-- RLS: only service role can insert; users can read their own logs
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own email logs"
  ON email_logs FOR SELECT
  USING (recipient_id = auth.uid());

-- Auto-create email_preferences row when profile is created
CREATE OR REPLACE FUNCTION create_email_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO email_preferences (profile_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created_email_prefs
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION create_email_preferences();

-- Backfill: create email_preferences for ALL existing profiles
INSERT INTO email_preferences (profile_id)
  SELECT id FROM profiles
  ON CONFLICT (profile_id) DO NOTHING;
