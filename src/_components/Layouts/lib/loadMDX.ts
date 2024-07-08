import { evaluateSync } from '@mdx-js/mdx';
import * as provider from '@mdx-js/react';
import withToc from '@stefanprobst/rehype-extract-toc';
import withTocExport from '@stefanprobst/rehype-extract-toc/mdx';
import matter from 'gray-matter';
import type { MDXContent } from 'mdx/types';
import * as runtime from 'react/jsx-runtime';
import recmaMdxEscapeMissingComponents from 'recma-mdx-escape-missing-components';
import withSlugs from 'rehype-slug';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import remarkUnwrapImages from 'remark-unwrap-images';

interface MDXResult {
  mdxContent: MDXContent | null;
  frontmatter: any; // Replace 'any' with the actual type of your frontmatter
}

export function loadMDX(
  source: string,
  format: string = 'mdx',
  wrapper: string | null = null
): MDXResult {
  const remarkPlugins: any[] = []; // Replace 'any' with the actual type of your plugins
  remarkPlugins.push(remarkGfm);
  remarkPlugins.push(remarkFrontmatter);
  remarkPlugins.push(remarkMdxFrontmatter);
  remarkPlugins.push(remarkUnwrapImages);

  const rehypePlugins: any[] = []; // Replace 'any' with the actual type of your plugins
  rehypePlugins.push(withSlugs);
  rehypePlugins.push(withToc);
  rehypePlugins.push(withTocExport);

  try {
    const { data, content } = matter(source);
    if (wrapper) {
      const wrappedMDX = `<${wrapper}>${content}</${wrapper}>`;
      // @ts-expect-error
      const { default: mdx, tableOfContents } = evaluateSync(wrappedMDX, {
        ...provider,
        ...runtime,
        Fragment: runtime.Fragment,
        format: format as 'detect' | 'md' | 'mdx' | null | undefined,
        remarkPlugins,
        rehypePlugins,
        recmaPlugins: [recmaMdxEscapeMissingComponents],
      });
      const frontmatter = data || {};
      if (tableOfContents) {
        frontmatter.tableOfContents = tableOfContents;
      }
      return { mdxContent: mdx, frontmatter };
    }
    // @ts-expect-error
    const { default: mdx, tableOfContents } = evaluateSync(content, {
      ...provider,
      ...runtime,
      Fragment: runtime.Fragment,
      // useDynamicImport: true,
      format: format as 'detect' | 'md' | 'mdx' | null | undefined,
      remarkPlugins,
      rehypePlugins,
      recmaPlugins: [recmaMdxEscapeMissingComponents],
    });
    const frontmatter = data || {};
    if (tableOfContents) {
      frontmatter.tableOfContents = tableOfContents;
    }
    return { mdxContent: mdx, frontmatter };
  } catch (error) {
    return { mdxContent: null, frontmatter: { title: '' } };
  }
}

// interface WrappedComponentProps {
//   [key: string]: any; // Replace 'any' with the actual type of your props
// }

// function withWrapper(WrappedComponent: ComponentType<WrappedComponentProps>, Wrapper: ComponentType<any>) {
//   // Return a new component
//   return function (props: WrappedComponentProps) {
//     return (
//       <Wrapper>
//         <WrappedComponent {...props} />
//       </Wrapper>
//     );
//   };
// }
