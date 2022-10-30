import { defineConfig } from 'vite'
import path from 'node:path'
import pug from '@macropygia/vite-plugin-pug-static'
import input from '@macropygia/vite-plugin-glob-input'

export default defineConfig({
  root: 'src',
  build: {
    outDir: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    input({
      patterns: [
        'src/public/**/*.pug',
      ],
    }),
    pug(),
  ],
})
