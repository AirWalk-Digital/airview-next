import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import { mdComponents } from "../../components/MDXProvider";

export async function getStaticPaths() {
  const axios = require('axios');
  const client = axios.create({
    baseURL: process.env.ETHERPAD_BASE_URL,
    timeout: 1000,
    params: { 'apikey': process.env.ETHERPAD_API_KEY },
  });

  // List all pads
  // http://localhost:9001/api/1.2.1/listAllPads?apikey=f50403c112c30485607554afa2cf37675ef791681ad36001134f55b05a3deca1
  let paths = [];
  try {
    paths = (await client.get('listAllPads')).data.data.padIDs.map(id => {
      return {
        params: {
          id,
        }
      }
    });
  } catch (error) {
    console.log('Error fetching available pads');
    console.log(error)
  }

  return {
    paths,
    fallback: true, // can also be true or 'blocking'
  }
}

export async function getStaticProps(context) {
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
    pad = (await client.get('getText', {
      params: {
        padID: context.params.id,
      }
    })).data.data?.text
  } catch (error) {
    console.log(error.response)
  }
  const mdxSource = await serialize(pad ?? 'No content')
  return { props: { source: mdxSource, } }
}

export default function Pad(props) {
  return (
    <div className="wrapper">
      <MDXRemote {...props.source} components={mdComponents} />
    </div>
  )
}