import * as Sentry from '@sentry/nextjs'
import { CaptureConsole as CaptureConsoleIntegration } from '@sentry/integrations'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENV,
  integrations: [
    new CaptureConsoleIntegration({
      levels: ['error'],
    }),
  ],
})
