const path = require('path')
const withReactSvg = require('next-react-svg')
const withPlugins = require('next-compose-plugins')
const withTM = require('next-transpile-modules')(['little-state-machine-devtools'])

const nextConfig = {}

module.exports = withPlugins([
  nextConfig,
  [withReactSvg, { include: path.resolve(__dirname, 'src/svg') }],
  [withTM],
])
