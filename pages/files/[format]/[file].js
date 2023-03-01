import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import { mdComponents } from "../../../components/MDXProvider";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import remarkGfm from "remark-gfm";

import { theme } from '../../../constants/theme';
import fs from 'fs'
import path from 'path'
const glob = require('glob')

export async function getStaticPaths() {
  let paths = [];

  const targetDir = path.join(process.cwd(), 'markdown', '/')
  // grab all markdown files
  const docPaths = glob.sync(path.join(targetDir, '**/*.{md,mdx}'))
  
  docPaths.forEach(element => {
    paths.push({
      params: {
        format: 'pdf',
        file: element.replace(targetDir, ""),
      },
    })
    paths.push({
      params: {
        format: 'ppt',
        file: element.replace(targetDir, ""),
      },
    })
    paths.push({
      params: {
        format: 'mdx',
        file: element.replace(targetDir, ""),
      },
    })
    return paths;
  });
  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps(context) {
  const MDXoptions = {
    remarkPlugins: [remarkGfm],
    format: 'mdx',
  }
  let pad = null;
  try {
    const filePath = path.join(process.cwd(), 'markdown', context.params.file)
    const fileData = fs.readFileSync(filePath, "utf8")

    pad = fileData
    if (context.params.format === 'ppt') {
      pad = '<SlidePage>\n' + pad + '\n</SlidePage>'
    } else if (context.params.format === 'pdf') {
      pad = '<PrintSlide>\n' + pad + '\n</PrintSlide>'
    } else {
      pad = '<MDXViewer>\n' + pad + '\n</MDXViewer>'
    }
  } catch (error) {
    console.log(error)
  }
  let mdxSource = '';
  try {
    const error_message = `
    <SlidePage>
    # Error
    
    Content not loaded
    </SlidePage>
    `
    mdxSource = await serialize(pad ?? error_message, { scope: {}, mdxOptions : { ...MDXoptions}, parseFrontmatter: true } )
  } catch (error) {
    const error_message = `
    <SlidePage>
    # Error
    
    Content formatted incorrectly
    </SlidePage>
    `
    console.log('serialize error : ', error)
    mdxSource = await serialize(error_message, { scope: {}, mdxOptions : { ...MDXoptions}, parseFrontmatter: true } )
  }
  return { props: { source: mdxSource, file: context.params.file, format: context.params.format } }
}

export default function Pad(props) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {props.source && <MDXRemote {...props.source} components={mdComponents} />}
    </ThemeProvider>
  )
}