import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'
import { isAbortError } from '@/lib/errors'
import { router } from './router'
import '@fontsource-variable/inter'
import '@fontsource-variable/playfair-display'
import './styles/globals.css'
import './lib/sentry'

// Suppress AbortError from Supabase internal promise rejections
// (caused by React StrictMode double-mount aborting in-flight requests)
window.addEventListener('unhandledrejection', (event) => {
  if (isAbortError(event.reason)) {
    event.preventDefault()
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
