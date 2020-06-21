import run from '@rollup/plugin-run'
import json from '@rollup/plugin-json'
import copy from 'rollup-plugin-copy'

export default {
  input: 'src/main.js',
  output: {
    dir: 'build',
    format: 'cjs'
  },
  plugins: [
    run(),
    json(),
    copy({
      targets: [
        { src: './index.html', dest: 'build' }
      ]
    })
  ]
}
