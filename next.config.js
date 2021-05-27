const path = require('path')
const withReactSvg = require('next-react-svg')
const withPlugins = require('next-compose-plugins')
const { withSentryConfig } = require('@sentry/nextjs')

const withTM = require('next-transpile-modules')([
  'little-state-machine-devtools',
  '@bangle.dev/core',
  '@bangle.dev/react',
  '@bangle.dev/tooltip',
  '@bangle.dev/emoji',
  '@popperjs/core/lib/popper-lite',
])

const nextConfig = {}

const SentryWebpackPluginOptions = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENV,
}

module.exports = withPlugins([
  nextConfig,
  [withReactSvg, { include: path.resolve(__dirname, 'src/svg') }],
  [withTM],
  [withSentryConfig, SentryWebpackPluginOptions],
])
