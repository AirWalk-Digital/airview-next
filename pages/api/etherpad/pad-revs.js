export default async function handler(req, res) {
  const axios = require('axios');
  const client = axios.create({
    baseURL: process.env.ETHERPAD_BASE_URL,
    timeout: 1000,
    params: { 'apikey': process.env.ETHERPAD_API_KEY },
  });
  let revision = null;
  try {
    // Get text for pad
    let padData = (await client.get('listSavedRevisions', {
      params: {
        padID: req.query.pad,
      }
    })).data.data?.savedRevisions
    if (padData) {revision = Math.max(...padData)}
    // console.log('revision :', revision, ' data : ', padData)
    res.status(200).json({ rev: revision, })
  } catch (error) {
    res.status(500).json({error: 'error fetching revision (listSavedRevisions): ' + error})
  }
}