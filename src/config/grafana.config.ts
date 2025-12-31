export interface GrafanaDashboard {
  name: string;
  uid: string;
  url: string;
  height: number;
  theme?: 'light' | 'dark';
}

const GRAFANA_BASE_URL = import.meta.env.VITE_GRAFANA_URL || 'http://localhost:3000';

export const GRAFANA_DASHBOARDS: GrafanaDashboard[] = [
  {
    name: 'Home Overview',
    uid: '15eFwnJVk',
    url: `${GRAFANA_BASE_URL}/d/15eFwnJVk?orgId=1&refresh=30s&kiosk`,
    height: 800,
    theme: 'dark',
  },
  {
    name: 'Energy Monitoring',
    uid: 'QTY4PR14z',
    url: `${GRAFANA_BASE_URL}/d/QTY4PR14z?orgId=1&from=now/d&to=now/d+1d&refresh=1m&kiosk`,
    height: 600,
    theme: 'dark',
  },
  {
    name: 'Heizung',
    uid: 'SfyRMk14z',
    url: `${GRAFANA_BASE_URL}/d/SfyRMk14z?orgId=1&from=now/d&to=now/d+1d&refresh=30s&kiosk`,
    height: 800,
    theme: 'dark',
  },
  {
    name: 'Wasser',
    uid: 'z6Qnimb4z',
    url: `${GRAFANA_BASE_URL}/d/z6Qnimb4z?orgId=1&refresh=30s&kiosk`,
    height: 800,
    theme: 'dark',
  },
  {
    name: 'Autos',
    uid: 'fea25ugabezuoc',
    url: `${GRAFANA_BASE_URL}/d/fea25ugabezuoc?orgId=1&refresh=30s&kiosk`,
    height: 800,
    theme: 'dark',
  },
];

export const getGrafanaUrl = (dashboardName: string): string | undefined => {
  const dashboard = GRAFANA_DASHBOARDS.find((d) => d.name === dashboardName);
  return dashboard?.url;
};

export const getGrafanaByUid = (uid: string): GrafanaDashboard | undefined => {
  return GRAFANA_DASHBOARDS.find((d) => d.uid === uid);
};
