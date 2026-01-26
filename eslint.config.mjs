import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import antfu from '@antfu/eslint-config'

import tailwind from 'eslint-plugin-tailwindcss'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu({
    formatters: true,
    rules: {
      'no-console': 'warn',
      'vue/max-attributes-per-line': 'warn',
      'vue/require-default-prop': 'warn',
    },
  }),
  ...tailwind.configs['flat/recommended'],
  {
    settings: {
      tailwindcss: {
        config: `${dirname(fileURLToPath(import.meta.url))}/app/assets/css/main.css`,
      },
    },
    rules: {
      'tailwindcss/no-custom-classname': 'off',
    },
  },
)
