import type { ContentItem, SiteConfig } from '../../site.config';

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

type FrontMatter = {
  [key: string]: string;
};

type FileContent = {
  file: GitHubFile | null;
  frontmatter: FrontMatter | null;
};

type GitHubFile = {
  type?: 'dir' | 'file' | 'submodule' | 'symlink';
  size?: number;
  name?: string;
  path: string;
  content?: string | undefined;
  sha: string;
  url?: string;
  git_url?: string | null;
  html_url?: string | null;
  download_url: string | null;
};

// export type { ContentItem, SiteConfig, siteConfig };
export type {
  ContentItem,
  FileContent,
  FrontMatter,
  GitHubFile,
  LinkItem,
  MenuItem,
  MenuStructure,
  SiteConfig,
};
