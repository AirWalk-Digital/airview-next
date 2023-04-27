import { useRef, useEffect, useState } from 'react';
import { Previewer } from 'pagedjs'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import { mdComponents } from "../../../components/MDXProvider";
import PrintSlide from '../../../layouts/PrintSlide'
import SlidePage from '../../../layouts/SlidePage'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import remarkGfm from "remark-gfm";
import remarkUnwrapImages from 'remark-unwrap-images';
import { theme } from '../../../constants/theme';
import fs from 'fs'
import path from 'path'

const glob = require('glob')


function removeSection(pad, tagName) {
  const re = new RegExp("<" + tagName + "\\s+[^>]*>(.*?)</" + tagName + ">", "gs");  
  return (pad.replace(re, ""));
}

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
    remarkPlugins: [remarkGfm, remarkUnwrapImages],
    format: 'mdx',
  }
  let pad = null;

  try {

    const filePath = path.join(process.cwd(), 'markdown', context.params.file)
    const fileData = fs.readFileSync(filePath, "utf8")

    if (context.params.file === 'test.mdx') {
      pad = fileData
    } else {
      const filePath = path.join(process.cwd(), 'markdown', context.params.file)
      const fileData = fs.readFileSync(filePath, 'utf-8')
      pad = fileData
    }

    if (context.params.format === 'ppt') {
      pad = '<SlidePage>\n' + pad + '\n</SlidePage>'
    } else if (context.params.format === 'pdf') {
      pad = '<div>'+pad+'</div>'
    } else {
      pad = removeSection(pad, 'TitleSlide');
      pad = '<MDXViewer>\n' + pad.replace('---','') + '\n</MDXViewer>'
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
    `;

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

  return { 
    props: { 
      source: mdxSource, 
      file: context.params.file, 
      format: context.params.format 
    } 
  }
}

export default function Pad({source}) {
  const [hydrated, setHydrated] = useState(false);
  const mdxContainer = useRef(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      const paged = new Previewer();
      paged
        .preview(mdxContainer.current.innerHTML, [], document.body)
        .then((flow) => {
          console.log('Rendered', flow.total, 'pages.');
        });
    }
  }, [hydrated]);

  return (
    <div ref={mdxContainer} style={{ display: 'none' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {hydrated && <MDXRemote {...source} components={mdComponents} />}
      </ThemeProvider>
      </div>
  )
}