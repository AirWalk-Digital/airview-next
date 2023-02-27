import { serialize } from 'next-mdx-remote/serialize'
import fs from 'fs'
import path from 'path'
import remarkGfm from "remark-gfm";


export default async function handler(req, res) {
  
  let pad = null;
  try {
    
    const filePath = path.join(process.cwd(), 'markdown', req.query.file)
    const fileData = fs.readFileSync(filePath)
  
    pad = fileData
    if (req.query.format === 'ppt') {
      pad = '<SlidePage>\n' + pad + '\n</SlidePage>'
    } else if (req.query.format === 'print') {
      pad = '<PrintSlide>\n' + pad + '\n</PrintSlide>'
    } else {
      pad = '<MDXViewer>\n' + pad + '\n</MDXViewer>'
    }
  } catch (error) {
    console.log(error)
  }
  const mdxSource = await serialize(pad ?? error_message, { scope: {}, mdxOptions : { ...MDXoptions}, parseFrontmatter: true } )
  res.status(200).json({ source: mdxSource, })

}