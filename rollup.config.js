import run from '@rollup/plugin-run'
import json from '@rollup/plugin-json'

export default {
  input: 'src/main.js',
  output: {
    dir: 'build',
    format: 'cjs'
  },
  plugins: [run(), json()]
}
