import { serialize } from 'next-mdx-remote/serialize'
import remarkGfm from "remark-gfm";


function removeSection(pad, tagName) {
  const re = new RegExp("<" + tagName + "\\s+[^>]*>(.*?)</" + tagName + ">", "gs");  
  return (pad.replace(re, ""));
}

export default async function handler(req, res) {
  const axios = require('axios');
  const client = axios.create({
    baseURL: process.env.ETHERPAD_BASE_URL,
    timeout: 1000,
    params: { 'apikey': process.env.ETHERPAD_API_KEY },
  });
  let pad = null;
  try {
    // Get text for one pad
    // http://localhost:9001/api/1/getText?apikey=f50403c112c30485607554afa2cf37675ef791681ad36001134f55b05a3deca1&padID=yXpdXIgw-NSdfaXdXoGQ
    let resp = (await client.get('getText', {
      params: {
        padID: req.query.pad,
        rev: req.query.rev,
      }
    }))
    pad = resp.data.data?.text.text
    // console.log('fetch-pad.js : rev: ', req.query.rev, ' | pad : ', pad)

    // console.log('pad : ', pad)
    if (req.query.format === 'ppt') {
      pad = '<SlidePage>\n' + pad + '\n</SlidePage>'
    } else if (req.query.format === 'print') {
      pad = '<PrintSlide>\n' + pad + '\n</PrintSlide>'
    } else if (req.query.format === 'pdf') {
      pad = '<div>\n' + pad.replace(/---/g, '') + '\n</div>'
    } else {
      pad = removeSection(pad, 'TitleSlide')
      pad = '<MDXViewer>\n' + pad + '\n</MDXViewer>'
    }
  } catch (error) {
    console.log(error)
  }
  const MDXoptions = {
    remarkPlugins: [remarkGfm],
    format: 'mdx',
  }
  let errorcode = false;
  if (!pad) {errorcode = true}
  // console.log('fetch-pad.js : ', pad)
  const error_message = `
  <SlidePage>
  # Error
  
  Content formatted incorrectly
  </SlidePage>
  `
  const mdxSource = await serialize(pad ?? error_message, { scope: {}, mdxOptions : { ...MDXoptions}, parseFrontmatter: true } )
  res.status(200).json({ source: mdxSource, error: errorcode })
}