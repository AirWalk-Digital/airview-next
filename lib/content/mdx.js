import * as provider from '@mdx-js/react'
import * as runtime from 'react/jsx-runtime'
import { evaluateSync } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkUnwrapImages from 'remark-unwrap-images';
import * as matter from 'gray-matter';


export function useMDX(source, format='mdx', wrapper=null) {
  const remarkPlugins = []
  remarkPlugins.push(remarkGfm);
  remarkPlugins.push(remarkFrontmatter);
  remarkPlugins.push(remarkMdxFrontmatter);
  remarkPlugins.push(remarkUnwrapImages);

  if (wrapper) {
    const {data, content} = matter(source);
    const wrappedMDX = `<${wrapper}>${content}</${wrapper}>`
    const exports = evaluateSync(wrappedMDX, {
      ...provider,
      ...runtime,
      useDynamicImport: true,
      format: format,
      remarkPlugins,
    });
    return { mdxContent: exports.default, frontmatter: data };

  } else {

  const exports = evaluateSync(source, {
    ...provider,
    ...runtime,
    useDynamicImport: true,
    format: format,
    remarkPlugins,
  });

  return { mdxContent: exports.default, frontmatter: exports.frontmatter };
}
}

function withWrapper(WrappedComponent, Wrapper) {
  // Return a new component
  return function(props) {
    return (
      <Wrapper>
        <WrappedComponent {...props} />
      </Wrapper>
    );
  }
}


// export function useMdxold(defaults) {
//     const [state, setState] = useState({ ...defaults, file: null })
  
//     const { run: setConfig } = useDebounceFn(
//       async (config) => {
//         let frontmatter = null;
//         // process frontmatter
//         try {
//           if (config.pageParms && config.pageParms.parms) { delete config.pageParms.parms };
//           const { content, data } = matter(config.value);
//           frontmatter = { ...data, ...config.pageParms };
//           config.value = matter.stringify(content, { ...frontmatter });
//         } catch (error) {
//           // // console.log(error)
//         }
  
//         const file = new VFile({ basename: 'example.mdx', value: config.value })
//         if (frontmatter) { file.frontmatter = frontmatter };
  
//         const capture = (name) => () => (tree) => {
//           file.data[name] = tree
//         }
  
//         const remarkPlugins = []
  
//         if (config.gfm) remarkPlugins.push(remarkGfm)
//         if (config.frontmatter) {
//           remarkPlugins.push(remarkFrontmatter);
//           remarkPlugins.push(remarkMdxFrontmatter);
//         }
//         if (config.unwrapImages) remarkPlugins.push(remarkUnwrapImages)
//         // remarkPlugins.push(capture('mdast'))
  
//         try {
//           file.result = (
//             await evaluate(file, {
//               ...provider,
//               ...runtime,
//               useDynamicImport: true,
//               remarkPlugins,
//               // rehypePlugins: [capture('hast')],
//               // recmaPlugins: [capture('esast')],
  
//             })
//           ).default
//         } catch (error) {
//           // // // console.log('output:evalutate:Error: ', error)
//           // // // console.log('output:evalutate:Error/Content: ', file)
//           const message =
//             error instanceof VFileMessage ? error : new VFileMessage(error)
  
//           if (!file.messages.includes(message)) {
//             file.messages.push(message)
//           }
  
//           message.fatal = true
//         }
//         // // // console.log('output:evalutate:Success/Content: ', file)
//         setState({ ...config, file })
//       },
//       { leading: true, trailing: true, wait: 0 }
//     )
  
//     return [state, setConfig]
//   }