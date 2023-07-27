import { cacheWrite } from '@/lib/redis';
import * as matter from 'gray-matter';
import { siteConfig } from "../../../site.config.js";

const toSnakeCase = (str) =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.toLowerCase())
    .join('_');

export default async function createHandler(req, res) {
  const axios = require('axios');
  const client = axios.create({
    baseURL: process.env.ETHERPAD_BASE_URL,
    timeout: 1000,
    params: { apikey: process.env.ETHERPAD_API_KEY },
  });

  let pad = req.query.padID;
  let initialContent = req.body.initialContent;

  try {
    const matterData = matter(initialContent, { excerpt: false }).data || null;
    

    // // console.log('API:/api/etherpad/new:matterData.type: ', matterData.type)
    // const collection = Object.keys(siteConfig.content).find(key => siteConfig.content[key].reference === matterData.type).toLowerCase()
    const collection = matterData.type.toLowerCase()

    const cacheKey = 'etherpad:/' + collection + '/' + toSnakeCase(matterData.title) + '.etherpad';

    
    let padMetadata;

    
      padMetadata = {
        title: matterData.title,
        url: '/' + collection + '/' + toSnakeCase(matterData.title) + '.etherpad',
        collection: collection,
        padID: pad,
        ...matterData
      };

    // Create new pad if it's not an import
    if (!req.query.import) {
      await client
        .get('createPad', {
          params: {
            padID: pad,
            text: initialContent,
          },
        })
        .catch((error) => {
          console.error('API:/api/etherpad/createPad:ERROR:', error);
          res.status(500).json({ error: 'Error creating or initializing pad: ' + error });
          return;
        });
    }

    await cacheWrite(cacheKey, JSON.stringify(padMetadata)); // cache for 24 hours
    res.status(200).json({ status: 'Pad created and initialized', padID: pad });
  } catch (error) {
    console.error('API:/api/etherpad/new:ERROR:', error);
    res.status(500).json({ error: 'Error creating new Pad: ' + error });
  }
}
