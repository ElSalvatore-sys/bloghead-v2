-- 017_enquiries.sql
-- Lightweight enquiry system for first-contact between users and artists/venues

-- Enquiry type enum
CREATE TYPE enquiry_type AS ENUM ('BOOKING', 'PRICING', 'AVAILABILITY', 'GENERAL');

-- Enquiry status enum
CREATE TYPE enquiry_status AS ENUM ('PENDING', 'READ', 'RESPONDED', 'ARCHIVED');

-- Enquiries table
CREATE TABLE enquiries (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  entity_type   favorite_type NOT NULL,  -- reuse existing enum: 'ARTIST' | 'VENUE'
  artist_id     UUID REFERENCES artists(id) ON DELETE CASCADE,
  venue_id      UUID REFERENCES venues(id) ON DELETE CASCADE,
  enquiry_type  enquiry_type NOT NULL DEFAULT 'GENERAL',
  status        enquiry_status NOT NULL DEFAULT 'PENDING',
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT,
  message       TEXT NOT NULL,
  event_date    DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Exactly one entity FK must be non-null
  CONSTRAINT enquiry_entity_check CHECK (
    (entity_type = 'ARTIST' AND artist_id IS NOT NULL AND venue_id IS NULL) OR
    (entity_type = 'VENUE'  AND venue_id  IS NOT NULL AND artist_id IS NULL)
  )
);

-- Partial unique: prevent duplicate pending enquiry from same user to same entity
CREATE UNIQUE INDEX uq_enquiry_artist_pending
  ON enquiries (sender_id, artist_id)
  WHERE artist_id IS NOT NULL AND status = 'PENDING';

CREATE UNIQUE INDEX uq_enquiry_venue_pending
  ON enquiries (sender_id, venue_id)
  WHERE venue_id IS NOT NULL AND status = 'PENDING';

-- Lookup indexes
CREATE INDEX idx_enquiries_artist ON enquiries (artist_id) WHERE artist_id IS NOT NULL;
CREATE INDEX idx_enquiries_venue  ON enquiries (venue_id)  WHERE venue_id  IS NOT NULL;
CREATE INDEX idx_enquiries_sender ON enquiries (sender_id);

-- Reuse existing trigger function from 003_core_tables.sql
CREATE TRIGGER set_enquiries_updated_at
  BEFORE UPDATE ON enquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Users can see enquiries they sent
CREATE POLICY enquiries_select_sender ON enquiries
  FOR SELECT USING (auth.uid() = sender_id);

-- Artists can see enquiries sent to them
CREATE POLICY enquiries_select_artist ON enquiries
  FOR SELECT USING (
    artist_id IN (SELECT id FROM artists WHERE profile_id = auth.uid())
  );

-- Venues can see enquiries sent to them
CREATE POLICY enquiries_select_venue ON enquiries
  FOR SELECT USING (
    venue_id IN (SELECT id FROM venues WHERE profile_id = auth.uid())
  );

-- Authenticated users can insert their own enquiries
CREATE POLICY enquiries_insert ON enquiries
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Providers can update status of enquiries sent to them
CREATE POLICY enquiries_update_artist ON enquiries
  FOR UPDATE USING (
    artist_id IN (SELECT id FROM artists WHERE profile_id = auth.uid())
  ) WITH CHECK (
    artist_id IN (SELECT id FROM artists WHERE profile_id = auth.uid())
  );

CREATE POLICY enquiries_update_venue ON enquiries
  FOR UPDATE USING (
    venue_id IN (SELECT id FROM venues WHERE profile_id = auth.uid())
  ) WITH CHECK (
    venue_id IN (SELECT id FROM venues WHERE profile_id = auth.uid())
  );
