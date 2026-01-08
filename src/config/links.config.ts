import {
  mdiLinkVariant,
  mdiHomeAutomation,
  mdiSolarPower,
  mdiThermometer,
  mdiCctv,
  mdiRouterWireless,
  mdiServer,
  mdiWaterPump,
  mdiCarElectric,
  mdiRobotVacuum,
} from '@mdi/js';
import type { LinkConfig, LinkIconKey } from '../types/links';

export const LINK_ICON_OPTIONS: Array<{ key: LinkIconKey; label: string; path: string }> = [
  { key: 'link', label: 'Link', path: mdiLinkVariant },
  { key: 'dashboard', label: 'Dashboard', path: mdiHomeAutomation },
  { key: 'energy', label: 'Energy', path: mdiSolarPower },
  { key: 'climate', label: 'Climate', path: mdiThermometer },
  { key: 'cameras', label: 'Cameras', path: mdiCctv },
  { key: 'router', label: 'Router', path: mdiRouterWireless },
  { key: 'server', label: 'Server', path: mdiServer },
  { key: 'water', label: 'Water', path: mdiWaterPump },
  { key: 'ev', label: 'EV', path: mdiCarElectric },
  { key: 'vacuum', label: 'Vacuum', path: mdiRobotVacuum },
];

export const LINK_ICON_MAP = LINK_ICON_OPTIONS.reduce((acc, item) => {
  acc[item.key] = item;
  return acc;
}, {} as Record<LinkIconKey, { key: LinkIconKey; label: string; path: string }>);

export const DEFAULT_LINKS: LinkConfig[] = [
  {
    id: 'links-dashboard',
    name: 'Main Dashboard',
    url: 'http://192.168.1.10',
    iconKey: 'dashboard',
  },
  {
    id: 'links-grafana',
    name: 'Grafana',
    url: 'http://192.168.1.20',
    iconKey: 'energy',
  },
  {
    id: 'links-iobroker',
    name: 'IoBroker Admin',
    url: 'http://192.168.1.30',
    iconKey: 'server',
  },
  {
    id: 'links-cameras',
    name: 'Cameras',
    url: 'http://192.168.1.40',
    iconKey: 'cameras',
  },
  {
    id: 'links-router',
    name: 'Router',
    url: 'http://192.168.1.1',
    iconKey: 'router',
  },
  {
    id: 'links-evcc',
    name: 'EVCC',
    url: 'http://192.168.1.50',
    iconKey: 'ev',
  },
  {
    id: 'links-vacuum',
    name: 'Vacuum',
    url: 'http://192.168.1.60',
    iconKey: 'vacuum',
  },
  {
    id: 'links-water',
    name: 'Water Monitor',
    url: 'http://192.168.1.70',
    iconKey: 'water',
  },
];
