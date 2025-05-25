import json from '@eslint/json'
import markdown from '@eslint/markdown'
import neostandard from 'neostandard'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  ...neostandard({ ts: true }),
  { files: ['**/*.json'], plugins: { json }, language: 'json/json', extends: ['json/recommended'] },
  { files: ['**/*.md'], plugins: { markdown }, language: 'markdown/gfm', extends: ['markdown/recommended'] },
])
