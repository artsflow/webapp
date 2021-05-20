const path = require('path')
const withReactSvg = require('next-react-svg')
const withPlugins = require('next-compose-plugins')
const withTM = require('next-transpile-modules')(['little-state-machine-devtools'])
const { withSentryConfig } = require('@sentry/nextjs')

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
