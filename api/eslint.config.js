import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default defineConfig(
  js.configs.recommended,
  tseslint.configs.recommended,
  eslintPluginPrettierRecommended
)
