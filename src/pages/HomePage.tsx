import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function HomePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Bloghead V2</CardTitle>
          <CardDescription>
            Artists, Venues, and Organizers marketplace for the German
            entertainment industry.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Connect with artists, book venues, and organize unforgettable events.
          </p>
          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
