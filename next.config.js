const path = require('path')
const withReactSvg = require('next-react-svg')
const withPlugins = require('next-compose-plugins')

const nextConfig = {}

module.exports = withPlugins([
  nextConfig,
  [withReactSvg, { include: path.resolve(__dirname, 'src/svg') }],
])
