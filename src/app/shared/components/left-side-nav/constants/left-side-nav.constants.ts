export const sideMenuGroups: any[] = [
  {
    text: 'Cadence',
    icon: 'cadence-icon',
    path: '/dashboard',
    id: 0,
    parentId: null
  },
  {
    text: 'Hot Sheet',
    icon: 'hotsheets-icon',
    path: '/hotsheets',
    id: 1,
    parentId: null
  },
  {
    text: 'APS',
    icon: 'aps-icon',
    path: '',
    id: 2,
    parentId: null
  },
  {
    text: 'Scheduling Priorities',
    icon: 'scheduling-priorities-icon',
    path: '/aps/priorities',
    parentId: 2,
    id: 3
  },
  {
    text: 'Process Flow',
    icon: 'process-flow-icon',
    path: '/aps/process-flow',
    parentId: 2,
    id: 4,
    children: ['/aps/create-process-flow', '/aps/edit-process-flow']
  },
  {
    text: 'APS Settings',
    icon: 'aps-settings-icon',
    path: '/aps/settings',
    parentId: 2,
    id: 5
  },
  {
    text: 'APS Data Issues',
    icon: 'aps-data-issues-icon',
    path: '/aps/issues',
    parentId: 2,
    id: 6
  },
  {
    text: 'Vizer Integration',
    icon: 'hotsheets-icon',
    path: '',
    parentId: null,
    id: 7
  },
  {
    text: 'MatrixUI Configuration',
    icon: 'settings',
    path: '/vizer-integration/matrixui-configuration',
    parentId: 7,
    id: 8
  },
  {
    text: 'Vizer Display Groups',
    icon: 'work-center-group-icon',
    path: '/vizer-integration/vizer-display-groups',
    parentId: 7,
    id: 9
  },
  {
    text: 'Data Table Maintenance',
    icon: 'data-table-maintenance-icon',
    path: '',
    id: 10,
    parentId: null
  },
  {
    text: 'Work Centers',
    icon: 'work-centers-icon',
    path: '/data-table-maintenance/work-centers',
    parentId: 10,
    id: 11
  },
  {
    text: 'Work Orders',
    icon: 'work-orders-icon',
    path: '/data-table-maintenance/work-orders',
    parentId: 10,
    id: 12,
    children: ['/data-table-maintenance/work-order-details']
  },
  {
    text: 'Part Info',
    icon: 'part-info-icon',
    path: '/data-table-maintenance/part-info',
    parentId: 10,
    id: 13
  },
  {
    text: 'Sales Orders',
    icon: 'work-orders-icon',
    path: '/data-table-maintenance/sales-orders',
    parentId: 10,
    id: 14,
    children: ['/data-table-maintenance/sales-order-details']
  },
  {
    text: 'Admin',
    icon: 'admin-icon',
    path: '',
    id: 15,
    parentId: null
  },
  {
    text: 'Integrations',
    icon: 'integrations',
    path: '',
    parentId: 15,
    id: 16
  },
  {
    text: 'Failed Integration Requests',
    icon: 'datasets',
    path: '/admin/integrations/failed-integration-requests',
    parentId: 16,
    id: 17
  },
  {
    text: 'Datasets',
    icon: 'datasets',
    path: '/admin/integrations/datasets',
    parentId: 16,
    id: 18
  },
  {
    text: 'Export',
    icon: 'export-icon',
    path: '/admin/export',
    parentId: 15,
    id: 19
  },
  {
    text: 'Custom Attributes',
    icon: 'attribute-icon',
    path: '/admin/custom-attributes',
    parentId: 15,
    id: 19
  },
  {
    text: 'Work-Related Illness and Injuries',
    icon: 'star-icon',
    path: '/admin/work-related-illness-and-injuries',
    parentId: 15,
    id: 20
  }
]
