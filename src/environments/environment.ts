import packageInfo from 'package.json';

export const environment = {
  production: false,
  VIZTOK_AUTOMATION_URL: 'https://viztocdev.acclimate-saas.com/viztoccore',
  VERSION: packageInfo.version,
  AUTH_CONFIG: {
    authority: 'https://qa-jis.simplicitetl.com',
    clientId: 'viztoc_api',
    client_secret: 'E8480CF7-8F90-4150-8069-4665ED4BA0BC'
  }
};
