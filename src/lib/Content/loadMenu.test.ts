// adjust the import path as needed
// adjust the import path as needed
import type { FileContent } from '@/lib/Types';

import { siteConfig } from '../../../site.config'; // adjust the import path as needed
import { convertToMenu, nestMenu } from './loadMenu';

describe('convertToMenu', () => {
  it('should correctly convert primary content to menu', () => {
    const primary: FileContent[] = [
      {
        file: {
          path: 'services/test_1_service/_index.md',
          sha: 'dummySha',
          download_url: 'dummyDownloadUrl',
        },
        frontmatter: {
          title: 'Test Service 1',
          provider: 'providers/azure_l78ryc2t',
        },
      },
      {
        file: {
          path: 'services/test_2_service/_index.mdx',
          sha: 'dummySha',
          download_url: 'dummyDownloadUrl',
        },
        frontmatter: { title: 'Test 2 Service' },
      },
      {
        file: {
          path: 'services/test_2_service/blah.mdx',
          sha: 'dummySha',
          download_url: 'dummyDownloadUrl',
        },
        frontmatter: { title: 'Test 2 content' },
      },
    ];

    const result = convertToMenu(primary, siteConfig);

    expect(result).toEqual({
      primary: [
        { label: 'Test Service 1', url: 'services/test_1_service/_index.md' },
        { label: 'Test 2 Service', url: 'services/test_2_service/_index.mdx' },
      ],
      relatedContent: {
        'services/test_2_service': {
          chapters: [
            {
              label: 'Test 2 content',
              url: 'services/test_2_service/blah.mdx',
            },
          ],
        },
        'providers/azure_l78ryc2t': {
          services: [
            {
              label: 'Test Service 1',
              url: 'services/test_1_service/_index.md',
            },
          ],
        },
      },
    });
  });
});

describe('nestMenu', () => {
  it('should correctly convert a menu to the nested structure', () => {
    const menuInput = {
      primary: [
        { label: 'Test Service 1', url: 'services/test_1_service/_index.md' },
        { label: 'Test 2 Service', url: 'services/test_2_service/_index.mdx' },
      ],
      relatedContent: {
        'services/test_2_service': {
          chapters: [
            {
              label: 'Test 2 content',
              url: 'services/test_2_service/blah.mdx',
            },
          ],
        },
        'providers/azure_l78ryc2t': {
          services: [
            {
              label: 'Test Service 1',
              url: 'services/test_1_service/_index.md',
            },
          ],
        },
      },
    };

    const result = nestMenu(menuInput, 'dummy');

    expect(result).toEqual({
      menu: [
        {
          label: 'Test Service 1',
          url: '/dummy/services/test_1_service/_index.md',
        },
        {
          label: 'Test 2 Service',
          url: '/dummy/services/test_2_service/_index.mdx',
          menuItems: [
            {
              groupTitle: 'Chapters',
              links: [
                {
                  label: 'Test 2 content',
                  url: '/dummy/services/test_2_service/blah.mdx',
                },
              ],
            },
          ],
        },
      ],
    });
  });
});
