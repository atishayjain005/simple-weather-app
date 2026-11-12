import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', testMatch: '**/*.spec.js',
  use: { channel: 'chromium', baseURL: 'http://127.0.0.1:4183' },
  webServer: { command: 'VITE_OPENWEATHER_API_KEY=test-placeholder npm run dev -- --host 127.0.0.1 --port 4183', url: 'http://127.0.0.1:4183', reuseExistingServer: false },
  projects: [ {name:'desktop',use:{viewport:{width:1280,height:800}}}, {name:'mobile',use:{viewport:{width:320,height:740}}} ],
});
