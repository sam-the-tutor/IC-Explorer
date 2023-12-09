// vite.config.ts
import react from "file:///home/samthetutor/ICP/Token-explorer/Explorer/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { defineConfig } from "file:///home/samthetutor/ICP/Token-explorer/Explorer/node_modules/vite/dist/node/index.js";
import environment from "file:///home/samthetutor/ICP/Token-explorer/Explorer/node_modules/vite-plugin-environment/dist/index.js";
import dotenv from "file:///home/samthetutor/ICP/Token-explorer/Explorer/node_modules/dotenv/lib/main.js";
dotenv.config();
var vite_config_default = defineConfig({
  root: "src",
  build: {
    outDir: "../dist",
    emptyOutDir: true
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis"
      }
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true
      }
    }
  },
  plugins: [
    react(),
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
    environment({ BACKEND_CANISTER_ID: "" })
  ],
  test: {
    environment: "jsdom",
    setupFiles: "setupTests.ts",
    cache: { dir: "../node_modules/.vitest" }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9zYW10aGV0dXRvci9JQ1AvVG9rZW4tZXhwbG9yZXIvRXhwbG9yZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3NhbXRoZXR1dG9yL0lDUC9Ub2tlbi1leHBsb3Jlci9FeHBsb3Jlci92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9zYW10aGV0dXRvci9JQ1AvVG9rZW4tZXhwbG9yZXIvRXhwbG9yZXIvdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgZW52aXJvbm1lbnQgZnJvbSAndml0ZS1wbHVnaW4tZW52aXJvbm1lbnQnO1xuaW1wb3J0IGRvdGVudiBmcm9tICdkb3RlbnYnO1xuXG5kb3RlbnYuY29uZmlnKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHJvb3Q6ICdzcmMnLFxuICBidWlsZDoge1xuICAgIG91dERpcjogJy4uL2Rpc3QnLFxuICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBlc2J1aWxkT3B0aW9uczoge1xuICAgICAgZGVmaW5lOiB7XG4gICAgICAgIGdsb2JhbDogJ2dsb2JhbFRoaXMnLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwcm94eToge1xuICAgICAgJy9hcGknOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly8xMjcuMC4wLjE6NDk0MycsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgZW52aXJvbm1lbnQoJ2FsbCcsIHsgcHJlZml4OiAnQ0FOSVNURVJfJyB9KSxcbiAgICBlbnZpcm9ubWVudCgnYWxsJywgeyBwcmVmaXg6ICdERlhfJyB9KSxcbiAgICBlbnZpcm9ubWVudCh7IEJBQ0tFTkRfQ0FOSVNURVJfSUQ6ICcnIH0pLFxuICBdLFxuICB0ZXN0OiB7XG4gICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXG4gICAgc2V0dXBGaWxlczogJ3NldHVwVGVzdHMudHMnLFxuICAgIGNhY2hlOiB7IGRpcjogJy4uL25vZGVfbW9kdWxlcy8udml0ZXN0JyB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sWUFBWTtBQUVuQixPQUFPLE9BQU87QUFFZCxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixNQUFNO0FBQUEsRUFDTixPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixhQUFhO0FBQUEsRUFDZjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osZ0JBQWdCO0FBQUEsTUFDZCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsTUFDVjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsTUFDaEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sWUFBWSxPQUFPLEVBQUUsUUFBUSxZQUFZLENBQUM7QUFBQSxJQUMxQyxZQUFZLE9BQU8sRUFBRSxRQUFRLE9BQU8sQ0FBQztBQUFBLElBQ3JDLFlBQVksRUFBRSxxQkFBcUIsR0FBRyxDQUFDO0FBQUEsRUFDekM7QUFBQSxFQUNBLE1BQU07QUFBQSxJQUNKLGFBQWE7QUFBQSxJQUNiLFlBQVk7QUFBQSxJQUNaLE9BQU8sRUFBRSxLQUFLLDBCQUEwQjtBQUFBLEVBQzFDO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
