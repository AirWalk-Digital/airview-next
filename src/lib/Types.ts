import type { ContentItem, SiteConfig } from '../../site.config';

type FileType = 'published' | 'draft' | 'note';

interface LinkItem {
  label: string;
  url: string;
  type?: FileType;
}

interface MenuItem {
  groupTitle?: string | undefined;
  links: LinkItem[];
}

interface MenuStructure {
  label: string;
  url?: string;
  isActive?: boolean;
  icon?: React.ComponentType<React.ComponentProps<'svg'>>;
  type?: FileType;
  links?: LinkItem[] | undefined;
}

interface MultiMenuStructure {
  label: string;
  menus: MenuStructure[];
}
// interface Directory {
//   [key: string]: LinkItem[];
// }

interface RelatedContent {
  [key: string]: LinkItem[];
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

// Type Definitions
type Metadata = {
  backend: 'github';
  owner: string;
  repo: string;
  path: string;
  branch?: string;
  encoding?: string;
};

type File = {
  name: string;
  frontmatter: FrontMatter | undefined;
  hash: string | undefined;
  type: FileType;
  metadata?: Metadata;
};

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
  File,
  FileContent,
  FileType,
  FrontMatter,
  GitHubFile,
  InputMenu,
  LinkItem,
  MatterData,
  MenuGroup,
  MenuItem,
  MenuStructure,
  Metadata,
  MultiMenuStructure,
  RelatedContent,
  SiteConfig,
};
