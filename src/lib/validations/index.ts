/**
 * Validation schemas barrel export
 */

// Common validators
export {
  germanPhoneSchema,
  germanPostalCodeSchema,
  emailSchema,
  passwordSchema,
  urlSchema,
  euroAmountSchema,
  dateSchema,
  futureDateSchema,
  uuidSchema,
  requiredString,
  paginationSchema,
  type PaginationInput,
} from './common'

// Profile
export {
  updateProfileSchema,
  type UpdateProfileInput,
  type ProfileRole,
} from './profile'

// Artist
export {
  createArtistSchema,
  updateArtistSchema,
  type CreateArtistInput,
  type UpdateArtistInput,
} from './artist'

// Venue
export {
  createVenueSchema,
  updateVenueSchema,
  type CreateVenueInput,
  type UpdateVenueInput,
} from './venue'

// Auth
export {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type LoginInput,
  type SignupInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
} from './auth'

// Event
export {
  createEventSchema,
  updateEventSchema,
  quickEventSetupSchema,
  type CreateEventInput,
  type UpdateEventInput,
  type QuickEventSetupInput,
  type EventType,
} from './event'

// Vendor/Booking
export {
  createBookingRequestSchema,
  vendorReviewSchema,
  type CreateBookingRequestInput,
  type VendorReviewInput,
} from './vendor'

// Planning
export {
  createTaskSchema,
  updateTaskSchema,
  createBudgetItemSchema,
  updateBudgetItemSchema,
  createGuestSchema,
  updateGuestSchema,
  bulkGuestImportSchema,
  type CreateTaskInput,
  type UpdateTaskInput,
  type TaskCategory,
  type TaskPriority,
  type CreateBudgetItemInput,
  type UpdateBudgetItemInput,
  type BudgetCategory,
  type CreateGuestInput,
  type UpdateGuestInput,
  type BulkGuestImportInput,
  type GuestType,
  type RsvpStatus,
} from './planning'
