import { Link } from 'react-router-dom'
import { Instagram, Twitter, Youtube, Music } from 'lucide-react'
import { cn } from '@/lib/utils'

const footerLinks = {
  Platform: [
    { label: 'How it Works', href: '/how-it-works' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'FAQ', href: '/faq' },
  ],
  Artists: [
    { label: 'Browse Artists', href: '/artists' },
    { label: 'Join as Artist', href: '/auth/register' },
    { label: 'Artist Dashboard', href: '/dashboard' },
  ],
  Venues: [
    { label: 'Browse Venues', href: '/venues' },
    { label: 'List Your Venue', href: '/auth/register' },
    { label: 'Venue Dashboard', href: '/dashboard' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Impressum', href: '/impressum' },
  ],
}

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
]

interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  return (
    <footer
      data-testid="footer"
      className={cn('border-t bg-muted dark:bg-gray-900', className)}
    >
      <div className="mx-auto max-w-[var(--max-w-container)] px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                {category}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <div className="flex items-center gap-2 text-foreground">
            <Music className="h-5 w-5 text-primary" />
            <span className="font-display text-lg font-semibold">
              bloghead
            </span>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} bloghead. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
