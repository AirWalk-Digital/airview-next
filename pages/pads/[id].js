import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import { useState, useEffect, } from 'react';
import { mdComponents } from "../../components/MDXProvider";

export async function getStaticPaths() {
  const axios = require('axios');
  const client = axios.create({
    baseURL: 'http://localhost:9001/api/1.2.1/',
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
    fallback: true,
  }
}

export async function getStaticProps(context) {
  const axios = require('axios');
  const client = axios.create({
    baseURL: 'http://localhost:9001/api/1.2.1',
    timeout: 1000,
    params: { apikey: process.env.ETHERPAD_API_KEY },
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
    console.log(error)
  }
  const mdxSource = await serialize(pad ?? 'No content')
  console.log(mdxSource)
  return { props: { source: mdxSource, padId: context.params.id, } }
}

export default function Pad(props) {
  const [pad, setPad] = useState(props);
  const [refreshToken, setRefreshToken] = useState(Math.random());

  useEffect(() => {
    fetch(`/api/fetch-pad?pad=${props.padId}`)
      .then((res) => res.json())
      .then(data => {
        setPad(data)
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        // Update refreshToken after 3 seconds so this event will re-trigger and update the data
        setTimeout(() => setRefreshToken(Math.random()), 5000);
      });
  }, [refreshToken]);

  return (
    <div className="wrapper">
      <MDXRemote {...pad.source} components={mdComponents} />
    </div>
  )
}