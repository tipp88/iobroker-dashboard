export type LinkIconKey =
  | 'link'
  | 'dashboard'
  | 'energy'
  | 'climate'
  | 'cameras'
  | 'router'
  | 'server'
  | 'water'
  | 'ev'
  | 'vacuum';

export interface LinkConfig {
  id: string;
  name: string;
  url: string;
  iconKey: LinkIconKey;
}
