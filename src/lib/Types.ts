import type { ContentItem, siteConfig } from '../../site.config';

interface LinkItem {
  label: string;
  url: string;
}

interface MenuItem {
  groupTitle?: string;
  links: LinkItem[];
}

interface MenuStructure {
  label: string;
  url: string;
  menuItems?: MenuItem[];
}

export { ContentItem, siteConfig };
export type { LinkItem, MenuItem, MenuStructure };
