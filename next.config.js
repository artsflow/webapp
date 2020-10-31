const path = require('path')
const withReactSvg = require('next-react-svg')
const withPlugins = require('next-compose-plugins')

module.exports = withPlugins([[withReactSvg, { include: path.resolve(__dirname, 'src/svg') }]])
