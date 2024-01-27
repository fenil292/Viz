import packageInfo from 'package.json';

export const environment = {
  production: true,
  VIZTOK_AUTOMATION_URL: '[@VAR:CoreApiUrl@]',
  VERSION: packageInfo.version,
  AUTH_CONFIG: {
    authority: 'https://jis.simplicitetl.com',
    clientId: '',
    client_secret: ''
  }
};