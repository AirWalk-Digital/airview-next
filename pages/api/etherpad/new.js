import { cacheWrite, cacheRead } from '@/lib/redis';
import * as matter from 'gray-matter';

const toSnakeCase = str =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
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

    console.log('createnewpad: ', req.body)

    const matterData = matter(initialContent, { excerpt: false }).data || null;
    const cacheKey = 'etherpad:new:/' +  matterData.type.toLowerCase() + '/' + toSnakeCase(matterData.title) + '.etherpad';
    
    let padMetadata;
    
    if (matterData.parentName) {
    padMetadata = {
            title: matterData.title,
            url: '/' +  matterData.type.toLowerCase() + '/' + toSnakeCase(matterData.title) + '.etherpad',
            [matterData.parentType]: matterData.parentName,
            collection: matterData.type.toLowerCase(),
            parent: matterData.parentName.toLowerCase(),
            padID: pad
        };
    } else {
        padMetadata = {
            title: matterData.title,
            url: '/' +  matterData.type.toLowerCase() + '/' + toSnakeCase(matterData.title) + '.etherpad',
            collection: matterData.type.toLowerCase(),
            padID: pad
        };

    }


    try {
        // Create new pad
        if (!req.query.import) {
        await client.get('createPad', {
            params: {
                padID: pad,
                text: initialContent
            },
        });
    } 

        
        await cacheWrite(cacheKey, JSON.stringify(padMetadata), 60 * 60 * 24); // cache for 24 hours

        console.log('cached: ', await cacheRead(cacheKey))
        //   // Set initial content for the new pad
        //   await client.get('setText', {
        //     params: {
        //       padID: pad,
        //       text: initialContent,
        //     },
        //   });

        res.status(200).json({ status: 'Pad created and initialized', padID: pad });
    } catch (error) {
        res.status(500).json({ error: 'Error creating or initializing pad: ' + error });
    }
}
