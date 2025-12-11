/**
 * Navigation contributions for CRM feature pack
 */

export const navContributions = [
  {
    id: 'crm',
    label: 'CRM',
    path: '/crm',
    icon: 'Users',
    children: [
      {
        id: 'crm-dashboard',
        label: 'Dashboard',
        path: '/crm',
        icon: 'LayoutDashboard',
      },
      {
        id: 'crm-contacts',
        label: 'Contacts',
        path: '/crm/contacts',
        icon: 'User',
      },
      {
        id: 'crm-companies',
        label: 'Companies',
        path: '/crm/companies',
        icon: 'Building',
      },
      {
        id: 'crm-deals',
        label: 'Deals',
        path: '/crm/deals',
        icon: 'TrendingUp',
      },
      {
        id: 'crm-activities',
        label: 'Activities',
        path: '/crm/activities',
        icon: 'Activity',
      },
      {
        id: 'crm-pipeline-stages',
        label: 'Pipeline Stages',
        path: '/crm/pipeline-stages',
        icon: 'Workflow',
      },
    ],
  },
];

