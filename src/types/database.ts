export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      amenities: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      artist_categories: {
        Row: {
          artist_id: string
          category_id: string
          created_at: string
          id: string
        }
        Insert: {
          artist_id: string
          category_id: string
          created_at?: string
          id?: string
        }
        Update: {
          artist_id?: string
          category_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "artist_categories_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artist_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      artist_genres: {
        Row: {
          artist_id: string
          created_at: string
          genre_id: string
          id: string
          is_primary: boolean
        }
        Insert: {
          artist_id: string
          created_at?: string
          genre_id: string
          id?: string
          is_primary?: boolean
        }
        Update: {
          artist_id?: string
          created_at?: string
          genre_id?: string
          id?: string
          is_primary?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "artist_genres_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artist_genres_genre_id_fkey"
            columns: ["genre_id"]
            isOneToOne: false
            referencedRelation: "genres"
            referencedColumns: ["id"]
          },
        ]
      }
      artist_media: {
        Row: {
          artist_id: string
          created_at: string
          description: string | null
          id: string
          is_primary: boolean
          sort_order: number
          thumbnail_url: string | null
          title: string | null
          type: Database["public"]["Enums"]["media_type"]
          url: string
        }
        Insert: {
          artist_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_primary?: boolean
          sort_order?: number
          thumbnail_url?: string | null
          title?: string | null
          type?: Database["public"]["Enums"]["media_type"]
          url: string
        }
        Update: {
          artist_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_primary?: boolean
          sort_order?: number
          thumbnail_url?: string | null
          title?: string | null
          type?: Database["public"]["Enums"]["media_type"]
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "artist_media_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      artists: {
        Row: {
          bio: string | null
          created_at: string
          deleted_at: string | null
          has_equipment: boolean
          hourly_rate: number | null
          id: string
          instagram: string | null
          is_public: boolean
          profile_id: string
          soundcloud: string | null
          spotify: string | null
          stage_name: string
          updated_at: string
          website: string | null
          years_experience: number | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          deleted_at?: string | null
          has_equipment?: boolean
          hourly_rate?: number | null
          id?: string
          instagram?: string | null
          is_public?: boolean
          profile_id: string
          soundcloud?: string | null
          spotify?: string | null
          stage_name: string
          updated_at?: string
          website?: string | null
          years_experience?: number | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          deleted_at?: string | null
          has_equipment?: boolean
          hourly_rate?: number | null
          id?: string
          instagram?: string | null
          is_public?: boolean
          profile_id?: string
          soundcloud?: string | null
          spotify?: string | null
          stage_name?: string
          updated_at?: string
          website?: string | null
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "artists_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      availability: {
        Row: {
          artist_id: string
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_available: boolean
          start_time: string
        }
        Insert: {
          artist_id: string
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_available?: boolean
          start_time: string
        }
        Update: {
          artist_id?: string
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_available?: boolean
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      availability_exceptions: {
        Row: {
          artist_id: string
          created_at: string
          end_time: string | null
          exception_date: string
          id: string
          is_available: boolean
          reason: string | null
          start_time: string | null
        }
        Insert: {
          artist_id: string
          created_at?: string
          end_time?: string | null
          exception_date: string
          id?: string
          is_available?: boolean
          reason?: string | null
          start_time?: string | null
        }
        Update: {
          artist_id?: string
          created_at?: string
          end_time?: string | null
          exception_date?: string
          id?: string
          is_available?: boolean
          reason?: string | null
          start_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "availability_exceptions_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_request_events: {
        Row: {
          actor_id: string
          booking_request_id: string
          created_at: string
          id: string
          new_status: Database["public"]["Enums"]["booking_status"]
          note: string | null
          previous_status: Database["public"]["Enums"]["booking_status"] | null
        }
        Insert: {
          actor_id: string
          booking_request_id: string
          created_at?: string
          id?: string
          new_status: Database["public"]["Enums"]["booking_status"]
          note?: string | null
          previous_status?: Database["public"]["Enums"]["booking_status"] | null
        }
        Update: {
          actor_id?: string
          booking_request_id?: string
          created_at?: string
          id?: string
          new_status?: Database["public"]["Enums"]["booking_status"]
          note?: string | null
          previous_status?: Database["public"]["Enums"]["booking_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_request_events_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_request_events_booking_request_id_fkey"
            columns: ["booking_request_id"]
            isOneToOne: false
            referencedRelation: "booking_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_requests: {
        Row: {
          agreed_rate: number | null
          artist_id: string
          artist_notes: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          end_time: string
          event_date: string
          id: string
          proposed_rate: number | null
          requester_id: string
          start_time: string
          status: Database["public"]["Enums"]["booking_status"]
          title: string
          updated_at: string
          venue_id: string
          venue_notes: string | null
        }
        Insert: {
          agreed_rate?: number | null
          artist_id: string
          artist_notes?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          end_time: string
          event_date: string
          id?: string
          proposed_rate?: number | null
          requester_id: string
          start_time: string
          status?: Database["public"]["Enums"]["booking_status"]
          title: string
          updated_at?: string
          venue_id: string
          venue_notes?: string | null
        }
        Update: {
          agreed_rate?: number | null
          artist_id?: string
          artist_notes?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          end_time?: string
          event_date?: string
          id?: string
          proposed_rate?: number | null
          requester_id?: string
          start_time?: string
          status?: Database["public"]["Enums"]["booking_status"]
          title?: string
          updated_at?: string
          venue_id?: string
          venue_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_requests_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_requests_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
          sort_order: number
          type: Database["public"]["Enums"]["category_type"]
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
          type: Database["public"]["Enums"]["category_type"]
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          type?: Database["public"]["Enums"]["category_type"]
        }
        Relationships: []
      }
      cities: {
        Row: {
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          postal_code_prefix: string | null
          region_id: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          postal_code_prefix?: string | null
          region_id: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          postal_code_prefix?: string | null
          region_id?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "cities_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          artist_id: string | null
          created_at: string
          favorite_type: Database["public"]["Enums"]["favorite_type"]
          id: string
          profile_id: string
          venue_id: string | null
        }
        Insert: {
          artist_id?: string | null
          created_at?: string
          favorite_type: Database["public"]["Enums"]["favorite_type"]
          id?: string
          profile_id: string
          venue_id?: string | null
        }
        Update: {
          artist_id?: string | null
          created_at?: string
          favorite_type?: Database["public"]["Enums"]["favorite_type"]
          id?: string
          profile_id?: string
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorites_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      email_logs: {
        Row: {
          created_at: string
          id: string
          metadata: Json
          recipient_email: string
          recipient_id: string | null
          resend_id: string | null
          status: string
          subject: string
          template: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json
          recipient_email: string
          recipient_id?: string | null
          resend_id?: string | null
          status?: string
          subject: string
          template: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json
          recipient_email?: string
          recipient_id?: string | null
          resend_id?: string | null
          status?: string
          subject?: string
          template?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_preferences: {
        Row: {
          booking_emails: boolean
          created_at: string
          id: string
          marketing_emails: boolean
          message_emails: boolean
          profile_id: string
          updated_at: string
        }
        Insert: {
          booking_emails?: boolean
          created_at?: string
          id?: string
          marketing_emails?: boolean
          message_emails?: boolean
          profile_id: string
          updated_at?: string
        }
        Update: {
          booking_emails?: boolean
          created_at?: string
          id?: string
          marketing_emails?: boolean
          message_emails?: boolean
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_preferences_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      enquiries: {
        Row: {
          id: string
          sender_id: string
          entity_type: Database["public"]["Enums"]["favorite_type"]
          artist_id: string | null
          venue_id: string | null
          enquiry_type: Database["public"]["Enums"]["enquiry_type"]
          status: Database["public"]["Enums"]["enquiry_status"]
          name: string
          email: string
          phone: string | null
          message: string
          event_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          entity_type: Database["public"]["Enums"]["favorite_type"]
          artist_id?: string | null
          venue_id?: string | null
          enquiry_type?: Database["public"]["Enums"]["enquiry_type"]
          status?: Database["public"]["Enums"]["enquiry_status"]
          name: string
          email: string
          phone?: string | null
          message: string
          event_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          entity_type?: Database["public"]["Enums"]["favorite_type"]
          artist_id?: string | null
          venue_id?: string | null
          enquiry_type?: Database["public"]["Enums"]["enquiry_type"]
          status?: Database["public"]["Enums"]["enquiry_status"]
          name?: string
          email?: string
          phone?: string | null
          message?: string
          event_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enquiries_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enquiries_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enquiries_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      genres: {
        Row: {
          created_at: string
          id: string
          name: string
          parent_id: string | null
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "genres_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "genres"
            referencedColumns: ["id"]
          },
        ]
      }
      message_threads: {
        Row: {
          booking_request_id: string | null
          created_at: string
          id: string
          last_message_at: string | null
          participant_one_id: string
          participant_two_id: string
          subject: string | null
        }
        Insert: {
          booking_request_id?: string | null
          created_at?: string
          id?: string
          last_message_at?: string | null
          participant_one_id: string
          participant_two_id: string
          subject?: string | null
        }
        Update: {
          booking_request_id?: string | null
          created_at?: string
          id?: string
          last_message_at?: string | null
          participant_one_id?: string
          participant_two_id?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_threads_booking_request_id_fkey"
            columns: ["booking_request_id"]
            isOneToOne: false
            referencedRelation: "booking_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_threads_participant_one_id_fkey"
            columns: ["participant_one_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_threads_participant_two_id_fkey"
            columns: ["participant_two_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          read_at: string | null
          sender_id: string | null
          thread_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          read_at?: string | null
          sender_id?: string | null
          thread_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          read_at?: string | null
          sender_id?: string | null
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "message_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          deleted_at: string | null
          email: string
          first_name: string
          id: string
          is_verified: boolean
          last_name: string
          phone: string | null
          role: Database["public"]["Enums"]["profile_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          email: string
          first_name: string
          id: string
          is_verified?: boolean
          last_name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["profile_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string
          first_name?: string
          id?: string
          is_verified?: boolean
          last_name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["profile_role"]
          updated_at?: string
        }
        Relationships: []
      }
      regions: {
        Row: {
          country_code: string
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          country_code?: string
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          country_code?: string
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      venue_amenities: {
        Row: {
          amenity_id: string
          created_at: string
          id: string
          venue_id: string
        }
        Insert: {
          amenity_id: string
          created_at?: string
          id?: string
          venue_id: string
        }
        Update: {
          amenity_id?: string
          created_at?: string
          id?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_amenities_amenity_id_fkey"
            columns: ["amenity_id"]
            isOneToOne: false
            referencedRelation: "amenities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venue_amenities_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venue_media: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_primary: boolean
          sort_order: number
          thumbnail_url: string | null
          title: string | null
          type: Database["public"]["Enums"]["media_type"]
          url: string
          venue_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_primary?: boolean
          sort_order?: number
          thumbnail_url?: string | null
          title?: string | null
          type?: Database["public"]["Enums"]["media_type"]
          url: string
          venue_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_primary?: boolean
          sort_order?: number
          thumbnail_url?: string | null
          title?: string | null
          type?: Database["public"]["Enums"]["media_type"]
          url?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_media_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venues: {
        Row: {
          capacity_max: number | null
          capacity_min: number | null
          city_id: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          instagram: string | null
          is_public: boolean
          postal_code: string | null
          profile_id: string
          street: string | null
          type: Database["public"]["Enums"]["venue_type"]
          updated_at: string
          venue_name: string
          website: string | null
        }
        Insert: {
          capacity_max?: number | null
          capacity_min?: number | null
          city_id?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          instagram?: string | null
          is_public?: boolean
          postal_code?: string | null
          profile_id: string
          street?: string | null
          type?: Database["public"]["Enums"]["venue_type"]
          updated_at?: string
          venue_name: string
          website?: string | null
        }
        Update: {
          capacity_max?: number | null
          capacity_min?: number | null
          city_id?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          instagram?: string | null
          is_public?: boolean
          postal_code?: string | null
          profile_id?: string
          street?: string | null
          type?: Database["public"]["Enums"]["venue_type"]
          updated_at?: string
          venue_name?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "venues_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venues_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      search_artists: {
        Args: {
          filters?: Json
          result_limit?: number
          result_offset?: number
          search_query: string
        }
        Returns: {
          bio: string
          genre_names: string[]
          has_equipment: boolean
          hourly_rate: number
          id: string
          primary_image_url: string
          rank: number
          stage_name: string
          years_experience: number
        }[]
      }
      search_venues: {
        Args: {
          filters?: Json
          result_limit?: number
          result_offset?: number
          search_query: string
        }
        Returns: {
          amenity_names: string[]
          capacity_max: number
          capacity_min: number
          city_name: string
          description: string
          id: string
          primary_image_url: string
          rank: number
          type: Database["public"]["Enums"]["venue_type"]
          venue_name: string
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      booking_status:
        | "PENDING"
        | "ACCEPTED"
        | "DECLINED"
        | "CANCELLED"
        | "COMPLETED"
      category_type: "EVENT_TYPE" | "MUSIC_GENRE"
      enquiry_status: "PENDING" | "READ" | "RESPONDED" | "ARCHIVED"
      enquiry_type: "BOOKING" | "PRICING" | "AVAILABILITY" | "GENERAL"
      favorite_type: "ARTIST" | "VENUE"
      media_type: "IMAGE" | "VIDEO" | "AUDIO"
      profile_role: "USER" | "ARTIST" | "VENUE" | "ADMIN"
      venue_type:
        | "BAR"
        | "CLUB"
        | "RESTAURANT"
        | "HOTEL"
        | "EVENT_SPACE"
        | "OTHER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      booking_status: [
        "PENDING",
        "ACCEPTED",
        "DECLINED",
        "CANCELLED",
        "COMPLETED",
      ],
      category_type: ["EVENT_TYPE", "MUSIC_GENRE"],
      favorite_type: ["ARTIST", "VENUE"],
      media_type: ["IMAGE", "VIDEO", "AUDIO"],
      profile_role: ["USER", "ARTIST", "VENUE", "ADMIN"],
      venue_type: [
        "BAR",
        "CLUB",
        "RESTAURANT",
        "HOTEL",
        "EVENT_SPACE",
        "OTHER",
      ],
    },
  },
} as const
