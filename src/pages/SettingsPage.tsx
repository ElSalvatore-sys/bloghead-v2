/**
 * Settings Page
 * Profile settings with avatar upload and form fields
 */

import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AlertCircle, Mail } from 'lucide-react'
import {
  useCurrentProfile,
  useUpdateProfile,
  useUploadAvatar,
  useEmailPreferences,
  useUpdateEmailPreferences,
} from '@/hooks'
import { isAbortError } from '@/lib/errors'
import { useZodForm } from '@/lib/forms/use-zod-form'
import { updateProfileSchema, type UpdateProfileInput } from '@/lib/validations'
import { PageHeader } from '@/components/ui/page-header'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { AvatarUpload } from '@/components/upload/AvatarUpload'

export function SettingsPage() {
  const [searchParams] = useSearchParams()
  const { data: profile, isLoading, isError, error } = useCurrentProfile()
  const updateProfile = useUpdateProfile()
  const uploadAvatar = useUploadAvatar()
  const { data: emailPrefs, isLoading: emailPrefsLoading } =
    useEmailPreferences()
  const updateEmailPrefs = useUpdateEmailPreferences()

  // Scroll to notifications section when ?tab=notifications
  useEffect(() => {
    if (searchParams.get('tab') === 'notifications') {
      document
        .getElementById('notifications')
        ?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [searchParams])

  const form = useZodForm(updateProfileSchema, {
    defaultValues: {
      first_name: '',
      last_name: '',
      phone: '',
    },
  })

  // Populate form when profile loads
  useEffect(() => {
    if (profile) {
      form.reset({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
      })
    }
  }, [profile, form])

  const onSubmit = (data: UpdateProfileInput) => {
    updateProfile.mutate(data)
  }

  const handleAvatarUpload = async (file: File) => {
    uploadAvatar.mutate(file)
  }

  // Loading state
  if (isLoading) {
    return (
      <div data-testid="settings-page" className="space-y-6">
        <PageHeader title="Settings" description="Manage your account" />
        <LoadingSpinner fullScreen={false} />
      </div>
    )
  }

  // Error state (skip abort errors from StrictMode)
  if (isError && !isAbortError(error)) {
    return (
      <div data-testid="settings-page" className="space-y-6">
        <PageHeader title="Settings" description="Manage your account" />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to load profile</AlertTitle>
          <AlertDescription>
            {error?.message ?? 'Please try again'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const displayName = [profile?.first_name, profile?.last_name]
    .filter(Boolean)
    .join(' ')

  return (
    <div data-testid="settings-page" className="space-y-6">
      <PageHeader title="Settings" description="Manage your account" />

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Update your personal information and avatar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar upload */}
          <div className="flex justify-center">
            <AvatarUpload
              currentAvatarUrl={profile?.avatar_url}
              onUpload={handleAvatarUpload}
              uploading={uploadAvatar.isPending}
              userName={displayName}
            />
          </div>

          <Separator />

          {/* Profile form */}
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            data-testid="settings-form"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first_name">First name</Label>
                <Input
                  id="first_name"
                  data-testid="settings-first-name"
                  {...form.register('first_name')}
                />
                {form.formState.errors.first_name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.first_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Last name</Label>
                <Input
                  id="last_name"
                  data-testid="settings-last-name"
                  {...form.register('last_name')}
                />
                {form.formState.errors.last_name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.last_name.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile?.email ?? ''}
                disabled
                data-testid="settings-email"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+49 123 456 7890"
                data-testid="settings-phone"
                {...form.register('phone')}
              />
              {form.formState.errors.phone && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={updateProfile.isPending || !form.formState.isDirty}
                data-testid="settings-save"
              >
                {updateProfile.isPending ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Email Notifications */}
      <Card id="notifications" data-testid="email-preferences-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
          <CardDescription>
            Choose which email notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {emailPrefsLoading ? (
            <LoadingSpinner fullScreen={false} />
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="booking-emails">Booking updates</Label>
                  <p className="text-xs text-muted-foreground">
                    Get notified when you receive or update a booking
                  </p>
                </div>
                <Switch
                  id="booking-emails"
                  data-testid="toggle-booking-emails"
                  checked={emailPrefs?.booking_emails ?? true}
                  disabled={updateEmailPrefs.isPending}
                  onCheckedChange={(checked) =>
                    updateEmailPrefs.mutate({ booking_emails: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="message-emails">New messages</Label>
                  <p className="text-xs text-muted-foreground">
                    Get notified when someone sends you a message
                  </p>
                </div>
                <Switch
                  id="message-emails"
                  data-testid="toggle-message-emails"
                  checked={emailPrefs?.message_emails ?? true}
                  disabled={updateEmailPrefs.isPending}
                  onCheckedChange={(checked) =>
                    updateEmailPrefs.mutate({ message_emails: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketing-emails">Marketing</Label>
                  <p className="text-xs text-muted-foreground">
                    Occasional updates about new features
                  </p>
                </div>
                <Switch
                  id="marketing-emails"
                  data-testid="toggle-marketing-emails"
                  checked={emailPrefs?.marketing_emails ?? false}
                  disabled={updateEmailPrefs.isPending}
                  onCheckedChange={(checked) =>
                    updateEmailPrefs.mutate({ marketing_emails: checked })
                  }
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

    </div>
  )
}

export default SettingsPage
