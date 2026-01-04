import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      bundler: 'vite',
      webServerCommands: {
        // Only start client - server should be running manually
        default: 'npx nx run @org/client:dev',
        production: 'npx nx run @org/client:preview',
      },
      ciWebServerCommand: 'npx nx run @org/client:preview',
      ciBaseUrl: 'http://localhost:4200',
    }),
    baseUrl: 'http://localhost:4200',
    video: false,
    screenshotOnRunFailure: true,
    exitOnFail: false,
    viewportWidth: 1920,
    viewportHeight: 1080,
  },
});
