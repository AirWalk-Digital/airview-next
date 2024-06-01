import type { ContentItem, SiteConfig } from '../../site.config';

interface LinkItem {
  label: string;
  url: string;
}

interface MenuItem {
  groupTitle?: string | undefined;
  links: LinkItem[];
}

interface MenuStructure {
  label: string;
  url: string;
  menuItems?: MenuItem[];
}

interface Directory {
  [key: string]: LinkItem[];
}

interface RelatedContent {
  [key: string]: Directory;
}

type FrontMatter = {
  [key: string]: string;
};

type FileContent = {
  file: GitHubFile | null;
  frontmatter: FrontMatter | null;
};

interface MatterData {
  title: string;
  [key: string]: Date | string;
}

type MenuGroup = {
  label: string;
  url: string;
  menuItems?: MenuItem[];
};

// type NestedMenu = {
//   groupTitle: string;
//   links: { label: string; url: string }[];
// };

type InputMenu = {
  primary: MenuStructure[];
  relatedContent: {
    [key: string]: {
      [key: string]: LinkItem[];
    };
  };
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
  InputMenu,
  LinkItem,
  MatterData,
  MenuGroup,
  MenuItem,
  MenuStructure,
  RelatedContent,
  SiteConfig,
};
