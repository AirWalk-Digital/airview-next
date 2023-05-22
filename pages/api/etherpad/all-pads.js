export default async function handler(req, res) {
  const axios = require('axios');
  const client = axios.create({
    baseURL: process.env.ETHERPAD_BASE_URL,
    timeout: 1000,
    params: { apikey: process.env.ETHERPAD_API_KEY },
  });
  let revision = null;
  let padData = '';
  try {
    // Get text for pad
    padData = (await client.get('listAllPads', {

    })).data.data?.padIDs
  
    res.status(200).json({ pads: padData, })
  } catch (error) {
    res.status(500).json({error: 'error fetching all pads (listAllPads): ' + error})
  }
}