import { environment } from '../environments/environment';

export const endpoints = {
  AUTH: environment.VIZTOK_AUTOMATION_URL + '/Authentication',
  SOURCES: environment.VIZTOK_AUTOMATION_URL + '/Sources',
  DEMANDS: environment.VIZTOK_AUTOMATION_URL + '/Demands',
  HOTSHEET: environment.VIZTOK_AUTOMATION_URL + '/HotSheet',
  WORK_CENTER: environment.VIZTOK_AUTOMATION_URL + '/WorkCenter',
  WORK_ORDER: environment.VIZTOK_AUTOMATION_URL + '/WorkOrder',
  APS: environment.VIZTOK_AUTOMATION_URL + '/Aps',
  PRIORITY: environment.VIZTOK_AUTOMATION_URL + '/Priority',
  ADMIN: environment.VIZTOK_AUTOMATION_URL + '/Admin',
  PART: environment.VIZTOK_AUTOMATION_URL + '/Part',
  MATRIXUI: environment.VIZTOK_AUTOMATION_URL + '/MatrixUI',
  SALES_ORDER: environment.VIZTOK_AUTOMATION_URL + '/SalesOrder',
  VIZER_INTEGRATION: environment.VIZTOK_AUTOMATION_URL + '/VizerIntegration',
  CUSTOM_ATTRIBUTE: environment.VIZTOK_AUTOMATION_URL + '/CustomAttribute',
  OSHA: environment.VIZTOK_AUTOMATION_URL + '/Osha',
  DASHBOARD: environment.VIZTOK_AUTOMATION_URL + '/Dashboard'
};
