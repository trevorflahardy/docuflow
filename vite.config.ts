import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      enforce: 'pre', ...mdx({
        jsxImportSource: 'react', remarkPlugins: [
          remarkGfm
        ]
      })
    },
    react()
  ],
  publicDir: 'src/public'
})
