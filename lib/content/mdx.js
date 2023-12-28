import * as provider from "@mdx-js/react";
import * as runtime from "react/jsx-runtime";
import { evaluateSync } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkUnwrapImages from "remark-unwrap-images";
import withSlugs from "rehype-slug";
import withToc from "@stefanprobst/rehype-extract-toc";
import withTocExport from "@stefanprobst/rehype-extract-toc/mdx";
import * as matter from "gray-matter";

export function useMDX(source, format = "mdx", wrapper = null) {
  const remarkPlugins = [];
  remarkPlugins.push(remarkGfm);
  remarkPlugins.push(remarkFrontmatter);
  remarkPlugins.push(remarkMdxFrontmatter);
  remarkPlugins.push(remarkUnwrapImages);

  const rehypePlugins = [];

  rehypePlugins.push(withSlugs);
  rehypePlugins.push(withToc);
  rehypePlugins.push(withTocExport);

  try {
    const { data, content } = matter(source);
    if (wrapper) {
      const wrappedMDX = `<${wrapper}>${content}</${wrapper}>`;
      const exports = evaluateSync(wrappedMDX, {
        ...provider,
        ...runtime,
        useDynamicImport: true,
        format: format,
        remarkPlugins,
        rehypePlugins,
      });
      let frontmatter = data || {};
      if (exports.tableOfContents && exports.tableOfContents.length > 0) {
        frontmatter.tableOfContents = exports.tableOfContents;
      }
      return { mdxContent: exports.default, frontmatter: frontmatter };
    } else {
      const exports = evaluateSync(content, {
        ...provider,
        ...runtime,
        useDynamicImport: true,
        format: format,
        remarkPlugins,
        rehypePlugins,
      });
      let frontmatter = data || {};
      if (exports.tableOfContents && exports.tableOfContents.length > 0) {
        frontmatter.tableOfContents = exports.tableOfContents;
      }
      return { mdxContent: exports.default, frontmatter: frontmatter };
    }
  } catch (error) {
    console.log("lib/content/mdx:error: ", error);
    console.log("lib/content/mdx:matter: ", matter(source));
    
    return { mdxContent: null, frontmatter: { title: "error processing mdx" } };
  }
}

// export function useMDX(source, format='mdx', wrapper=null) {
//   const remarkPlugins = [];
//   remarkPlugins.push(remarkGfm);
//   remarkPlugins.push(remarkFrontmatter);
//   remarkPlugins.push(remarkMdxFrontmatter);
//   remarkPlugins.push(remarkUnwrapImages);

//   const rehypePlugins = [];

//   rehypePlugins.push(withSlugs);
//   rehypePlugins.push(withToc);
//   rehypePlugins.push(withTocExport)

//   if (wrapper) {
//     const {data, content} = matter(source);
//     const wrappedMDX = `<${wrapper}>${content}</${wrapper}>`
//     const exports = evaluateSync(wrappedMDX, {
//       ...provider,
//       ...runtime,
//       useDynamicImport: true,
//       format: format,
//       remarkPlugins,
//       rehypePlugins
//     });
//     let frontmatter = exports?.frontmatter || {}
//     if (exports.tableOfContents && exports.tableOfContents.length > 0) {frontmatter.tableOfContents = exports.tableOfContents}
//     return { mdxContent: exports.default, frontmatter: frontmatter};
//   } else {

//   const exports = evaluateSync(source, {
//     ...provider,
//     ...runtime,
//     useDynamicImport: true,
//     format: format,
//     remarkPlugins,
//     rehypePlugins
//   });
//   let frontmatter = exports?.frontmatter || {}
//   if (exports.tableOfContents && exports.tableOfContents.length > 0) {frontmatter.tableOfContents = exports.tableOfContents}
//   return { mdxContent: exports.default, frontmatter: frontmatter};
// }
// }

function withWrapper(WrappedComponent, Wrapper) {
  // Return a new component
  return function (props) {
    return (
      <Wrapper>
        <WrappedComponent {...props} />
      </Wrapper>
    );
  };
}
