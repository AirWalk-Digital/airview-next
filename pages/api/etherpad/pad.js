
export default async function handler(req, res) {
  const axios = require('axios');
  const client = axios.create({
    baseURL: process.env.ETHERPAD_BASE_URL,
    timeout: 1000,
    params: { 'apikey': process.env.ETHERPAD_API_KEY },
  });
  let pad = null;
  try {
    let resp = (await client.get('getText', {
      params: {
        padID: req.query.pad,
        rev: req.query.rev,
      }
    }))
    pad = resp.data.data?.text.text
  } catch (error) {
    console.log(error)
    res.status(500).json({error: 'error fetching pad: ' + error})
  }
      
  res.status(200).json({ content: pad })
}