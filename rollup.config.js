const buble = require('rollup-plugin-buble')
const flow = require('rollup-plugin-flow-no-whitespace')
const cjs = require('rollup-plugin-commonjs')
const node = require('rollup-plugin-node-resolve')
const replace = require('rollup-plugin-replace')
const version = process.env.VERSION || require('./package.json').version

module.exports = {
  entry: 'src/install.js',
  dest: 'index.js',
  format: 'cjs',
  moduleName: 'weex-vue-router',
  plugins: [replace({
    'process.env.NODE_ENV': '"development"'
  }), flow(), node(), cjs(), buble()],
  banner: `/**
 * weex-vue-router v${version}
 * (c) ${new Date().getFullYear()} dongnaebi
 * @license Apache-2.0
 */`
}