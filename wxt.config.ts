import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react', '@wxt-dev/auto-icons', '@wxt-dev/i18n/module'],
  manifest: {
    name: '__MSG_extName__',
    description: '__MSG_extDescription__',
    version: '1.0.0',
    permissions: ['contextMenus', 'downloads', 'storage'],
    action: {
      default_popup: 'entrypoints/popup/index.html',
      default_title: '__MSG_extName__'
    },
    default_locale: 'en'
  },
});
